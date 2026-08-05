const assert = require("node:assert/strict");
const path = require("node:path");

const importer = require(path.join(
  __dirname,
  "..",
  "outputs",
  "chrome-new-tab-dashboard-extension",
  "src",
  "core",
  "bookmark-import.js"
));

const tree = [{
  id: "0",
  title: "",
  children: [
    {
      id: "1",
      folderType: "bookmarks-bar",
      title: "书签栏",
      children: [
        { id: "root-1", title: "Runner", url: "https://example.com/" },
        {
          id: "work",
          title: "工作",
          children: [
            { id: "github", title: "GitHub", url: "https://github.com/" },
            {
              id: "docs",
              title: "文档",
              children: [
                { id: "chrome-docs", title: "Chrome Docs", url: "https://developer.chrome.com/docs/extensions/" },
                { id: "invalid", title: "Local", url: "file:///tmp/local.html" }
              ]
            }
          ]
        },
        {
          id: "inspiration",
          title: "灵感",
          children: [
            { id: "runner-duplicate", title: "Runner Duplicate", url: "https://example.com/#top" },
            { id: "fotor", title: "Fotor", url: "https://www.fotor.com/features/" }
          ]
        }
      ]
    },
    {
      id: "2",
      folderType: "other",
      title: "其他书签",
      children: [{ id: "ignored", title: "Ignored", url: "https://ignored.example/" }]
    }
  ]
}];

const preview = importer.buildBookmarkImportPreview(tree, { rootTitle: "书签栏" });
assert.equal(preview.found, true);
assert.deepEqual(preview.groups.map((group) => group.title), ["书签栏", "工作", "灵感"]);
assert.deepEqual(preview.groups.map((group) => group.validCount), [1, 2, 2]);
assert.equal(preview.groups[1].invalidCount, 1);
assert.equal(preview.groups.some((group) => group.bookmarks.some((item) => item.url.includes("ignored"))), false);

const initialState = {
  locale: "zh-CN",
  mode: "runner",
  categories: [{ id: "existing-work", name: "工作", icon: "工", order: 0, useCount: 2 }],
  shortcuts: [{
    id: "existing-github",
    categoryId: "existing-work",
    title: "GitHub",
    url: "https://github.com",
    color: "#ffffff"
  }],
  activeCategoryId: "existing-work",
  appearance: { theme: "dark" }
};
const initialJson = JSON.stringify(initialState);
const selectedIds = new Set(preview.groups.map((group) => group.id));
const result = importer.buildBookmarkImportCandidate(initialState, preview.groups, selectedIds);

assert.equal(JSON.stringify(initialState), initialJson, "bookmark import mutated the source state");
assert.deepEqual(result.stats, {
  createdCategories: 2,
  imported: 3,
  duplicates: 2,
  invalid: 1
});
assert.equal(result.candidate.categories.filter((category) => category.name === "工作").length, 1);
assert.equal(result.candidate.shortcuts.some((shortcut) => shortcut.url.includes("ignored.example")), false);
assert.equal(result.candidate.shortcuts.some((shortcut) => shortcut.title === "Chrome Docs"), true);
assert.equal(result.candidate.shortcuts.filter((shortcut) => shortcut.url.startsWith("https://example.com")).length, 1);
assert.equal(new Set(result.candidate.shortcuts.map((shortcut) => shortcut.id)).size, result.candidate.shortcuts.length);

assert.equal(importer.normalizeBookmarkUrl("https://EXAMPLE.com/").key, "https://example.com");
assert.equal(importer.normalizeBookmarkUrl("https://example.com/#section").key, "https://example.com");
assert.equal(importer.normalizeBookmarkUrl("javascript:alert(1)"), null);
assert.equal(importer.normalizeBookmarkUrl("chrome://extensions"), null);

const bulkBookmarks = Array.from({ length: 1200 }, (_, index) => ({
  title: `Site ${index}`,
  url: `https://bulk.example/items/${index}`
}));
const bulkGroups = [{
  id: "bulk",
  title: "Bulk",
  bookmarks: bulkBookmarks,
  validCount: bulkBookmarks.length,
  invalidCount: 0
}];
const bulkResult = importer.buildBookmarkImportCandidate({ categories: [], shortcuts: [] }, bulkGroups, new Set(["bulk"]));
assert.equal(bulkResult.stats.imported, 1200);
assert.equal(bulkResult.candidate.shortcuts.length, 1200);
assert.equal(bulkResult.candidate.categories[0].name, "Bulk");

assert.deepEqual(importer.buildBookmarkImportPreview([{ id: "0", children: [] }]), { found: false, groups: [] });

console.log("Bookmark import tests passed");
