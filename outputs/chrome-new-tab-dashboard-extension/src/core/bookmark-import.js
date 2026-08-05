(function exposeBookmarkImport(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.RunnerBookmarkImport = api;
})(typeof globalThis === "object" ? globalThis : this, function createBookmarkImportApi() {
  "use strict";

  function isRecord(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function findBookmarksBar(tree) {
    const roots = Array.isArray(tree) ? tree : [tree];
    const candidates = roots.flatMap((node) => (Array.isArray(node?.children) ? node.children : []));
    return candidates.find((node) => node?.folderType === "bookmarks-bar")
      || candidates.find((node) => String(node?.id) === "1")
      || null;
  }

  function collectBookmarkNodes(node, target = []) {
    if (!isRecord(node)) return target;
    if (typeof node.url === "string") {
      target.push({ title: String(node.title || "").trim(), url: node.url });
      return target;
    }
    (Array.isArray(node.children) ? node.children : []).forEach((child) => {
      collectBookmarkNodes(child, target);
    });
    return target;
  }

  function normalizeBookmarkUrl(value) {
    try {
      const parsed = new URL(String(value || "").trim());
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
      parsed.username = "";
      parsed.password = "";
      const url = parsed.href;
      const path = parsed.pathname === "/" ? "" : parsed.pathname;
      const key = `${parsed.protocol}//${parsed.host.toLowerCase()}${path}${parsed.search}`;
      return { url, key };
    } catch {
      return null;
    }
  }

  function buildBookmarkImportPreview(tree, options = {}) {
    const bar = findBookmarksBar(tree);
    if (!bar) return { found: false, groups: [] };

    const rootTitle = String(options.rootTitle || "Bookmarks Bar").trim() || "Bookmarks Bar";
    const groups = [];
    let rootGroup = null;

    (Array.isArray(bar.children) ? bar.children : []).forEach((child, index) => {
      if (typeof child?.url === "string") {
        if (!rootGroup) {
          rootGroup = {
            id: "bookmarks-bar-root",
            title: rootTitle,
            sourceIndex: index,
            bookmarks: []
          };
          groups.push(rootGroup);
        }
        rootGroup.bookmarks.push({ title: String(child.title || "").trim(), url: child.url });
        return;
      }

      if (!isRecord(child)) return;
      const bookmarks = collectBookmarkNodes(child);
      if (!bookmarks.length) return;
      groups.push({
        id: `bookmark-folder-${String(child.id || index)}`,
        title: String(child.title || rootTitle).trim() || rootTitle,
        sourceIndex: index,
        bookmarks
      });
    });

    return {
      found: true,
      groups: groups.map((group) => {
        let validCount = 0;
        let invalidCount = 0;
        group.bookmarks.forEach((bookmark) => {
          if (normalizeBookmarkUrl(bookmark.url)) validCount += 1;
          else invalidCount += 1;
        });
        return { ...group, validCount, invalidCount, totalCount: group.bookmarks.length };
      })
    };
  }

  function normalizedCategoryName(value) {
    return String(value || "").trim().slice(0, 24).toLocaleLowerCase();
  }

  function slug(value) {
    return String(value || "item")
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 24) || "item";
  }

  function uniqueId(seed, usedIds, prefix) {
    const base = `${prefix}-${slug(seed)}`;
    let candidate = base;
    let index = 2;
    while (usedIds.has(candidate)) {
      candidate = `${base}-${index}`;
      index += 1;
    }
    usedIds.add(candidate);
    return candidate;
  }

  function initials(value) {
    const text = String(value || "").trim();
    const compact = text.replace(/\s+/g, "");
    if (!compact) return "+";
    if (/^[\u4e00-\u9fff]/.test(compact)) return compact.slice(0, 2);
    return text.split(/\s+/).filter(Boolean).map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  }

  function inferTitle(url) {
    try {
      const host = new URL(url).hostname.replace(/^www\./i, "");
      return host.split(".")[0] || host || "Site";
    } catch {
      return "Site";
    }
  }

  function colorForUrl(url) {
    const palette = ["#62d5ff", "#d8ff3d", "#f4b168", "#ff6b7a", "#8fd3ff", "#c6f6d5"];
    let hash = 0;
    for (const character of String(url || "")) hash = ((hash * 31) + character.charCodeAt(0)) >>> 0;
    return palette[hash % palette.length];
  }

  function buildBookmarkImportCandidate(currentState, groups, selectedGroupIds) {
    const candidate = clone(currentState);
    candidate.categories = Array.isArray(candidate.categories) ? candidate.categories : [];
    candidate.shortcuts = Array.isArray(candidate.shortcuts) ? candidate.shortcuts : [];

    const selected = new Set(Array.from(selectedGroupIds || [], String));
    const usedCategoryIds = new Set(candidate.categories.map((category) => String(category.id || "")));
    const usedShortcutIds = new Set(candidate.shortcuts.map((shortcut) => String(shortcut.id || "")));
    const usedUrls = new Set(candidate.shortcuts
      .map((shortcut) => normalizeBookmarkUrl(shortcut.url)?.key)
      .filter(Boolean));
    const categoryByName = new Map(candidate.categories.map((category) => [normalizedCategoryName(category.name), category]));
    const stats = { createdCategories: 0, imported: 0, duplicates: 0, invalid: 0 };
    let firstImportedCategoryId = "";

    (Array.isArray(groups) ? groups : []).forEach((group) => {
      if (!selected.has(String(group.id))) return;
      const categoryName = String(group.title || "Bookmarks Bar").trim().slice(0, 24) || "Bookmarks Bar";
      const pending = [];

      (Array.isArray(group.bookmarks) ? group.bookmarks : []).forEach((bookmark) => {
        const normalized = normalizeBookmarkUrl(bookmark.url);
        if (!normalized) {
          stats.invalid += 1;
          return;
        }
        if (usedUrls.has(normalized.key)) {
          stats.duplicates += 1;
          return;
        }
        usedUrls.add(normalized.key);
        pending.push({
          title: String(bookmark.title || "").trim().slice(0, 36) || inferTitle(normalized.url).slice(0, 36),
          url: normalized.url
        });
      });

      if (!pending.length) return;

      const categoryKey = normalizedCategoryName(categoryName);
      let category = categoryByName.get(categoryKey);
      if (!category) {
        category = {
          id: uniqueId(categoryName, usedCategoryIds, "bookmark-category"),
          name: categoryName,
          icon: initials(categoryName),
          order: candidate.categories.length,
          useCount: 0
        };
        candidate.categories.push(category);
        categoryByName.set(categoryKey, category);
        stats.createdCategories += 1;
      }

      if (!firstImportedCategoryId) firstImportedCategoryId = category.id;
      pending.forEach((bookmark) => {
        candidate.shortcuts.push({
          id: uniqueId(bookmark.title, usedShortcutIds, "bookmark"),
          categoryId: category.id,
          title: bookmark.title,
          url: bookmark.url,
          color: colorForUrl(bookmark.url),
          iconUrl: "",
          useCount: 0
        });
        stats.imported += 1;
      });
    });

    if (firstImportedCategoryId) candidate.activeCategoryId = firstImportedCategoryId;
    candidate.categories.forEach((category, index) => {
      category.order = index;
    });
    return { candidate, stats };
  }

  return {
    buildBookmarkImportCandidate,
    buildBookmarkImportPreview,
    collectBookmarkNodes,
    findBookmarksBar,
    normalizeBookmarkUrl
  };
});
