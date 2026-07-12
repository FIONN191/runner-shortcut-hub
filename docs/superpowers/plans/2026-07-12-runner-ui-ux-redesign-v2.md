# Runner Shortcut Hub UI/UX Redesign v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver Runner Shortcut Hub 2.0.0 with a modular buildless architecture, Lost Starship, Liquid Glass, and Custom themes, a right-side Customize console, complete bilingual UI, and lossless migration of all v0.5.0 user data.

**Architecture:** Preserve the Manifest V3 buildless extension and existing data behavior while extracting pure state/storage/i18n/theme modules and focused UI modules. A compatibility bootstrap loads the modular application; all themes share one semantic DOM and switch through CSS design tokens and document data attributes.

**Tech Stack:** Manifest V3, semantic HTML, CSS custom properties, ES modules, Vanilla JavaScript, Chrome Storage, localStorage, Node.js tests, headless Chrome screenshots, local OFL fonts, local Lucide icons.

---

## File Map

### Runtime files

- `outputs/chrome-new-tab-dashboard-extension/app.js`: compatibility bootstrap and recoverable startup error.
- `outputs/chrome-new-tab-dashboard-extension/src/app.js`: state initialization, dependency wiring, and application lifecycle.
- `outputs/chrome-new-tab-dashboard-extension/src/core/defaults.js`: schema v2 defaults and constants.
- `outputs/chrome-new-tab-dashboard-extension/src/core/migration.js`: pure v1-to-v2 migration and normalization.
- `outputs/chrome-new-tab-dashboard-extension/src/core/storage.js`: Chrome Storage/localStorage reads, queued writes, recovery snapshots.
- `outputs/chrome-new-tab-dashboard-extension/src/core/i18n.js`: locale selection, interpolation, parity assertions.
- `outputs/chrome-new-tab-dashboard-extension/src/core/theme.js`: theme token application, custom-theme normalization, undo snapshots.
- `outputs/chrome-new-tab-dashboard-extension/src/core/import-export.js`: appearance, custom-theme, and full-data envelopes.
- `outputs/chrome-new-tab-dashboard-extension/src/locales/zh-CN.js`: Chinese UI dictionary.
- `outputs/chrome-new-tab-dashboard-extension/src/locales/en-US.js`: English UI dictionary.
- `outputs/chrome-new-tab-dashboard-extension/src/ui/shell.js`: toolbar, metadata, footer, and responsive shell rendering.
- `outputs/chrome-new-tab-dashboard-extension/src/ui/categories.js`: category list, edit actions, usage ordering, and drag state.
- `outputs/chrome-new-tab-dashboard-extension/src/ui/shortcuts.js`: shortcut grid, cards, icon rendering, menus, and drag state.
- `outputs/chrome-new-tab-dashboard-extension/src/ui/search.js`: command search, history, suggestions, and engines.
- `outputs/chrome-new-tab-dashboard-extension/src/ui/dialogs.js`: modal stack, focus trap, Escape, and focus restoration.
- `outputs/chrome-new-tab-dashboard-extension/src/ui/feedback.js`: toast, tooltip, loading, error, and status API.
- `outputs/chrome-new-tab-dashboard-extension/src/ui/customize.js`: right-side console, sections, live draft, and settings controls.
- `outputs/chrome-new-tab-dashboard-extension/newtab.html`: semantic shell and dialog containers.

### Design files

- `outputs/chrome-new-tab-dashboard-extension/styles/tokens.css`: semantic color, spacing, radius, typography, and motion tokens.
- `outputs/chrome-new-tab-dashboard-extension/styles/base.css`: reset, page, focus, and accessibility primitives.
- `outputs/chrome-new-tab-dashboard-extension/styles/typography.css`: local fonts and typography roles.
- `outputs/chrome-new-tab-dashboard-extension/styles/animations.css`: scene, card, drawer, drag, and reduced-motion rules.
- `outputs/chrome-new-tab-dashboard-extension/styles/components.css`: shared component geometry and state styles.
- `outputs/chrome-new-tab-dashboard-extension/styles/responsive.css`: container queries and viewport/zoom safeguards.
- `outputs/chrome-new-tab-dashboard-extension/styles/themes/lost-starship.css`: default industrial theme.
- `outputs/chrome-new-tab-dashboard-extension/styles/themes/liquid-glass.css`: glass depth theme.
- `outputs/chrome-new-tab-dashboard-extension/styles/themes/custom.css`: user-token theme.
- `outputs/chrome-new-tab-dashboard-extension/fonts/**`: subset font files and OFL licenses.
- `outputs/chrome-new-tab-dashboard-extension/icons/lucide.svg`: local icon sprite with MIT license notice.

### Tests and delivery

- `tests/fixtures/storage-v1-complete.json`: synthetic complete v1 state.
- `tests/fixtures/storage-v2-complete.json`: expected migrated state.
- `tests/migration-v2.test.cjs`: schema migration and data preservation.
- `tests/theme-v2.test.cjs`: theme normalization, token application, and import validation.
- `tests/i18n-v2.test.cjs`: key parity and hard-coded copy audit.
- `tests/interactions-v2.test.cjs`: CRUD, search, dialogs, keyboard, and ordering.
- `tests/visual/capture-v2.cjs`: viewport/theme/locale screenshots and overflow checks.
- `CHANGELOG.md`: version 2.0.0 changes and migration notes.
- `README.md`: v2 themes, installation, screenshots, and data guarantees.
- `docs/screenshots/v2/**`: baseline, themes, responsive, and locale screenshots.

---

### Task 1: Lock the v1 Data Contract and Add Schema v2 Migration

**Files:**
- Create: `tests/fixtures/storage-v1-complete.json`
- Create: `tests/fixtures/storage-v2-complete.json`
- Create: `tests/migration-v2.test.cjs`
- Create: `outputs/chrome-new-tab-dashboard-extension/src/core/defaults.js`
- Create: `outputs/chrome-new-tab-dashboard-extension/src/core/migration.js`

- [ ] **Step 1: Write a complete synthetic v1 fixture**

Include two categories, two shortcuts, one Data URL icon, one custom search engine, history, one custom background, one appearance preset, explicit order/use counts, and active IDs. Use only synthetic values:

```json
{
  "locale": "zh-CN",
  "mode": "runner",
  "activeSearchEngineId": "synthetic-search",
  "searchHistory": ["runner docs"],
  "showSearchHistory": true,
  "appearance": {
    "theme": "dark",
    "background": "custom",
    "customBackgroundImages": [{
      "id": "synthetic-bg",
      "name": "Synthetic",
      "image": "data:image/png;base64,AA==",
      "accentColor": "#3478d4"
    }],
    "activeCustomBackgroundId": "synthetic-bg",
    "accentColor": "#3478d4",
    "backgroundOpacity": 0.8,
    "backgroundBlur": 4,
    "panelOpacity": 0.7,
    "panelBlur": 8,
    "iconRadius": 14,
    "iconRadiusUnit": "px",
    "cardRadius": 6,
    "panelRadius": 10,
    "buttonRadius": 5,
    "fontScale": 1.08,
    "cardDensity": "compact"
  },
  "appearancePresets": [],
  "activeAppearancePresetId": "",
  "searchEngines": [{
    "id": "synthetic-search",
    "name": "Synthetic",
    "shortcut": "SY",
    "searchUrl": "https://example.com/?q={query}",
    "builtin": false
  }],
  "categories": [
    {"id":"alpha","name":"Alpha","icon":"A","order":1,"useCount":7},
    {"id":"beta","name":"Beta","icon":"B","order":0,"useCount":3}
  ],
  "shortcuts": [
    {"id":"one","categoryId":"alpha","title":"One","url":"https://one.example/","color":"#112233","iconUrl":"data:image/png;base64,AA=="},
    {"id":"two","categoryId":"beta","title":"Two","url":"https://two.example/","color":"#445566","iconUrl":""}
  ],
  "activeCategoryId": "alpha"
}
```

- [ ] **Step 2: Write the failing migration assertions**

```js
const migrated = migrateStateV2(v1);
assert.equal(migrated.schemaVersion, 2);
assert.equal(migrated.appearance.designTheme, "lost-starship");
assert.equal(migrated.appearance.colorMode, "dark");
assert.deepEqual(migrated.categories, v1.categories);
assert.deepEqual(migrated.shortcuts, v1.shortcuts);
assert.deepEqual(migrated.searchHistory, v1.searchHistory);
assert.equal(migrated.appearance.customTheme.cardRadius, 6);
assert.equal(migrated.appearance.customTheme.fontScale, 1.08);
assert.equal(JSON.stringify(v1), originalJson);
```

- [ ] **Step 3: Run the test and verify the missing module failure**

Run: `node tests/migration-v2.test.cjs`  
Expected: FAIL with `Cannot find module` or `migrateStateV2 is not defined`.

- [ ] **Step 4: Add schema v2 defaults and a pure migrator**

```js
export const SCHEMA_VERSION = 2;

export const defaultAppearanceV2 = Object.freeze({
  designTheme: "lost-starship",
  colorMode: "dark",
  customTheme: {
    backgroundPage: "#050505",
    backgroundPanel: "#0d100c",
    textPrimary: "#f4f5ef",
    textSecondary: "#969b8e",
    accent: "#d7ff00",
    border: "rgba(215,255,0,.28)",
    cardRadius: 0,
    panelRadius: 0,
    cardGap: 12,
    contentWidth: 1680,
    cardColumns: "auto",
    cardSize: "medium",
    shadowStrength: 0,
    surfaceBlur: 0,
    surfaceOpacity: 0.94,
    motionIntensity: 1,
    fontScale: 1,
    density: "comfortable",
    showGrid: true,
    showNoise: true,
    showScanlines: true,
    wallpaperMask: 0.55
  }
});

export function migrateStateV2(raw) {
  const source = JSON.parse(JSON.stringify(raw || {}));
  if (Number(source.schemaVersion) === SCHEMA_VERSION) return normalizeStateV2(source);
  const oldAppearance = source.appearance || {};
  return normalizeStateV2({
    ...source,
    schemaVersion: SCHEMA_VERSION,
    appearance: {
      ...oldAppearance,
      designTheme: "lost-starship",
      colorMode: ["light", "dark", "system"].includes(oldAppearance.theme) ? oldAppearance.theme : "dark",
      customTheme: {
        ...defaultAppearanceV2.customTheme,
        accent: oldAppearance.accentColor || defaultAppearanceV2.customTheme.accent,
        cardRadius: oldAppearance.cardRadius ?? 0,
        panelRadius: oldAppearance.panelRadius ?? 0,
        fontScale: oldAppearance.fontScale ?? 1,
        density: oldAppearance.cardDensity || "comfortable",
        surfaceBlur: oldAppearance.panelBlur ?? 0,
        surfaceOpacity: oldAppearance.panelOpacity ?? 0.94
      }
    }
  });
}
```

- [ ] **Step 5: Run migration tests**

Run: `node tests/migration-v2.test.cjs`  
Expected: `Migration v2 tests passed`.

- [ ] **Step 6: Commit and push the migration contract**

```bash
git add tests/fixtures tests/migration-v2.test.cjs outputs/chrome-new-tab-dashboard-extension/src/core
git commit -m "feat: add lossless v2 state migration"
git push
```

---

### Task 2: Add Design Tokens and Licensed Local Fonts

**Files:**
- Create: `outputs/chrome-new-tab-dashboard-extension/styles/tokens.css`
- Create: `outputs/chrome-new-tab-dashboard-extension/styles/typography.css`
- Create: `outputs/chrome-new-tab-dashboard-extension/fonts/**`
- Create: `tests/theme-v2.test.cjs`

- [ ] **Step 1: Write failing token/font assertions**

```js
assert.match(tokens, /--background-page:/);
assert.match(tokens, /--duration-scene:\s*600ms/);
assert.match(typography, /font-family:\s*"Barlow Condensed"/);
assert.match(typography, /font-family:\s*"Noto Sans SC"/);
assert.ok(fs.existsSync(path.join(fontRoot, "licenses", "OFL-Barlow.txt")));
assert.ok(fs.existsSync(path.join(fontRoot, "licenses", "OFL-Noto-Sans-SC.txt")));
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node tests/theme-v2.test.cjs`  
Expected: FAIL because `tokens.css` and fonts do not exist.

- [ ] **Step 3: Add semantic tokens**

```css
:root {
  --background-page: #050505;
  --background-panel: #0a0c09;
  --background-card: #0d100c;
  --background-hover: #14180f;
  --text-primary: #f4f5ef;
  --text-secondary: #969b8e;
  --text-muted: #62675d;
  --border-default: rgba(215, 255, 0, 0.28);
  --border-strong: rgba(215, 255, 0, 0.72);
  --action-primary: #d7ff00;
  --action-primary-hover: #e5ff4a;
  --action-danger: #ff4d45;
  --focus-ring: #6cf0ff;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --radius-icon: 0px;
  --radius-card: 0px;
  --radius-panel: 0px;
  --radius-control: 0px;
  --duration-instant: 80ms;
  --duration-fast: 140ms;
  --duration-normal: 220ms;
  --duration-slow: 360ms;
  --duration-scene: 600ms;
  --ease-ui: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-sharp: cubic-bezier(0.4, 0, 0.2, 1);
}
```

- [ ] **Step 4: Download fonts only from their official repositories, copy OFL files, and subset used weights**

Run official-source downloads into `/tmp/runner-fonts`, then use `pyftsubset` to emit WOFF2 files. Include Barlow Condensed 600/700, Inter 500/700, IBM Plex Mono 500/600, and a Noto Sans SC subset generated from both locale dictionaries plus common punctuation. Keep system CJK fallbacks after Noto Sans SC.

Expected packaged font payload: under 1.5 MB. Expected license files: four OFL texts.

- [ ] **Step 5: Add exact font roles**

```css
:root {
  --font-display-en: "Barlow Condensed", "Arial Narrow", sans-serif;
  --font-ui-en: "Inter", "Helvetica Neue", Arial, sans-serif;
  --font-display-zh: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-ui-zh: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-mono: "IBM Plex Mono", SFMono-Regular, Consolas, monospace;
}

html[lang="zh-CN"] { --font-display: var(--font-display-zh); --font-ui: var(--font-ui-zh); }
html[lang="en"] { --font-display: var(--font-display-en); --font-ui: var(--font-ui-en); }
```

- [ ] **Step 6: Run tests and commit design foundations**

Run: `node tests/theme-v2.test.cjs`  
Expected: `Theme v2 tests passed`.

```bash
git add outputs/chrome-new-tab-dashboard-extension/styles outputs/chrome-new-tab-dashboard-extension/fonts tests/theme-v2.test.cjs
git commit -m "feat: add v2 design tokens and licensed fonts"
git push
```

---

### Task 3: Add Modular Storage, State, i18n, and Theme Runtime

**Files:**
- Create: `outputs/chrome-new-tab-dashboard-extension/src/core/storage.js`
- Create: `outputs/chrome-new-tab-dashboard-extension/src/core/state.js`
- Create: `outputs/chrome-new-tab-dashboard-extension/src/core/i18n.js`
- Create: `outputs/chrome-new-tab-dashboard-extension/src/core/theme.js`
- Create: `outputs/chrome-new-tab-dashboard-extension/src/locales/zh-CN.js`
- Create: `outputs/chrome-new-tab-dashboard-extension/src/locales/en-US.js`
- Modify: `outputs/chrome-new-tab-dashboard-extension/app.js`
- Create: `outputs/chrome-new-tab-dashboard-extension/src/app.js`

- [ ] **Step 1: Write failing queued-write and locale-parity tests**

```js
const queue = createStorageQueue(fakeStorage);
await Promise.all([queue.write({ value: 1 }), queue.write({ value: 2 })]);
assert.equal(fakeStorage.lastValue.value, 2);
assert.deepEqual(Object.keys(zhCN).sort(), Object.keys(enUS).sort());
assert.equal(normalizeLocale("zh"), "zh-CN");
assert.equal(normalizeLocale("en-US"), "en");
```

- [ ] **Step 2: Add queued, atomic storage**

```js
export function createStorageQueue(adapter) {
  let chain = Promise.resolve();
  return {
    write(value) {
      const snapshot = structuredClone(value);
      const operation = chain.catch(() => {}).then(() => adapter.set(snapshot));
      chain = operation;
      return operation;
    },
    flush() { return chain; }
  };
}
```

- [ ] **Step 3: Add dictionary modules and translator**

```js
export function createTranslator(dictionaries, initialLocale = "zh-CN") {
  let locale = normalizeLocale(initialLocale);
  return {
    get locale() { return locale; },
    setLocale(next) { locale = normalizeLocale(next); },
    t(key, vars = {}) {
      let value = dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
      for (const [name, replacement] of Object.entries(vars)) {
        value = value.replaceAll(`{${name}}`, String(replacement));
      }
      return value;
    }
  };
}
```

- [ ] **Step 4: Add theme application and custom token whitelist**

```js
export function applyTheme(root, appearance) {
  root.dataset.theme = appearance.designTheme;
  root.dataset.colorMode = resolveColorMode(appearance.colorMode);
  const tokens = appearance.designTheme === "custom" ? sanitizeCustomTheme(appearance.customTheme) : {};
  for (const [name, value] of Object.entries(tokensToCss(tokens))) {
    root.style.setProperty(name, value);
  }
}
```

- [ ] **Step 5: Replace the old direct boot with a compatibility bootstrap**

```js
import("./src/app.js").catch((error) => {
  document.documentElement.dataset.bootError = "true";
  const status = document.querySelector("#bootStatus");
  if (status) status.hidden = false;
  console.error("Runner Shortcut Hub failed to start", error);
});
```

- [ ] **Step 6: Run all core tests and commit**

Run: `node tests/migration-v2.test.cjs && node tests/theme-v2.test.cjs && node tests/i18n-v2.test.cjs`  
Expected: all pass.

```bash
git add outputs/chrome-new-tab-dashboard-extension/src outputs/chrome-new-tab-dashboard-extension/app.js tests
git commit -m "refactor: add modular state and theme runtime"
git push
```

---

### Task 4: Rebuild the Semantic Application Shell

**Files:**
- Modify: `outputs/chrome-new-tab-dashboard-extension/newtab.html`
- Create: `outputs/chrome-new-tab-dashboard-extension/src/ui/shell.js`
- Create: `outputs/chrome-new-tab-dashboard-extension/styles/base.css`
- Create: `outputs/chrome-new-tab-dashboard-extension/styles/components.css`

- [ ] **Step 1: Write shell contract assertions**

```js
for (const id of [
  "globalToolbar", "categoryPanel", "commandSearch", "shortcutGrid",
  "systemStatusBar", "customizeDrawer", "toastRegion", "tooltip"
]) assert.match(html, new RegExp(`id="${id}"`));
assert.match(html, /aria-live="polite"/);
assert.match(html, /type="module"/);
```

- [ ] **Step 2: Run the shell test and verify it fails**

Run: `node tests/interactions-v2.test.cjs --shell`  
Expected: FAIL with missing `globalToolbar`.

- [ ] **Step 3: Replace the page shell while preserving functional form/dialog IDs**

```html
<body>
  <div id="appShell" class="app-shell">
    <nav id="globalToolbar" class="global-toolbar" aria-label=""></nav>
    <aside id="categoryPanel" class="category-panel"></aside>
    <main id="mainContent" class="main-content">
      <header id="commandHeader" class="command-header">
        <section id="brandStatus" class="brand-status"></section>
        <form id="commandSearch" class="command-search" autocomplete="off"></form>
      </header>
      <section id="activeCluster" class="active-cluster" aria-live="polite">
        <div id="shortcutGrid" class="shortcut-grid"></div>
      </section>
    </main>
    <footer id="systemStatusBar" class="system-status-bar"></footer>
  </div>
  <aside id="customizeDrawer" class="customize-drawer" aria-hidden="true"></aside>
  <div id="toastRegion" class="toast-region" aria-live="polite"></div>
  <div id="tooltip" class="tooltip" role="tooltip" hidden></div>
  <p id="bootStatus" class="boot-status" hidden></p>
  <script src="app.js"></script>
</body>
```

- [ ] **Step 4: Add shell rendering with localized metadata**

```js
export function renderShell(elements, model, t) {
  elements.version.textContent = `v${model.version}`;
  elements.theme.textContent = t(`theme.${model.appearance.designTheme}`);
  elements.websiteCount.textContent = String(model.shortcuts.length).padStart(2, "0");
  elements.categoryCount.textContent = String(model.categories.length).padStart(2, "0");
}
```

- [ ] **Step 5: Verify shell tests and commit**

Run: `node tests/interactions-v2.test.cjs --shell`  
Expected: `Shell contract passed`.

```bash
git add outputs/chrome-new-tab-dashboard-extension/newtab.html outputs/chrome-new-tab-dashboard-extension/src/ui/shell.js outputs/chrome-new-tab-dashboard-extension/styles
git commit -m "refactor: rebuild the new tab application shell"
git push
```

---

### Task 5: Implement Lost Starship and Shared Component States

**Files:**
- Create: `outputs/chrome-new-tab-dashboard-extension/styles/themes/lost-starship.css`
- Complete: `outputs/chrome-new-tab-dashboard-extension/styles/components.css`
- Create: `outputs/chrome-new-tab-dashboard-extension/styles/animations.css`
- Create: `outputs/chrome-new-tab-dashboard-extension/icons/lucide.svg`
- Create: `outputs/chrome-new-tab-dashboard-extension/icons/LICENSE-lucide.txt`

- [ ] **Step 1: Write failing theme/state assertions**

```js
assert.match(lostStarship, /\[data-theme="lost-starship"\]/);
assert.match(lostStarship, /--radius-card:\s*0px/);
assert.match(components, /:focus-visible/);
assert.match(animations, /prefers-reduced-motion:\s*reduce/);
assert.ok(fs.existsSync(lucideLicense));
```

- [ ] **Step 2: Add the Lost Starship semantic values**

```css
[data-theme="lost-starship"] {
  --background-page: #050505;
  --background-panel: #0a0c09;
  --background-card: #0d100c;
  --background-hover: #14180f;
  --text-primary: #f4f5ef;
  --text-secondary: #969b8e;
  --text-muted: #62675d;
  --border-default: rgba(215, 255, 0, 0.28);
  --border-strong: rgba(215, 255, 0, 0.72);
  --action-primary: #d7ff00;
  --action-primary-hover: #e5ff4a;
  --radius-card: 0px;
  --radius-panel: 0px;
  --radius-control: 0px;
  --shadow-card: none;
}
```

- [ ] **Step 3: Add shared interaction states**

```css
.shortcut-card {
  transition: border-color var(--duration-fast) var(--ease-sharp),
              background-color var(--duration-fast) var(--ease-ui),
              transform var(--duration-instant) var(--ease-sharp);
}
.shortcut-card:hover { border-color: var(--border-active); background: var(--background-hover); }
.shortcut-card:hover .site-icon { transform: translate(2px, -1px); }
.shortcut-card:active { transform: translateY(1px) scale(.995); }
:where(button, input, select, [tabindex]):focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 3px;
}
```

- [ ] **Step 4: Add reduced motion and bounded scene staging**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
  }
}
```

- [ ] **Step 5: Run static tests, capture the first Lost Starship screenshot, and commit**

Run: `node tests/theme-v2.test.cjs && node tests/visual/capture-v2.cjs --theme lost-starship --viewport 1440x900`  
Expected: PASS and `docs/screenshots/v2/lost-starship-1440x900-zh.png`.

```bash
git add outputs/chrome-new-tab-dashboard-extension/styles outputs/chrome-new-tab-dashboard-extension/icons docs/screenshots/v2
git commit -m "feat: implement the Lost Starship visual system"
git push
```

---

### Task 6: Reconnect Categories, Search, and Shortcut Cards

**Files:**
- Create: `outputs/chrome-new-tab-dashboard-extension/src/ui/categories.js`
- Create: `outputs/chrome-new-tab-dashboard-extension/src/ui/shortcuts.js`
- Create: `outputs/chrome-new-tab-dashboard-extension/src/ui/search.js`
- Modify: `outputs/chrome-new-tab-dashboard-extension/src/app.js`
- Extend: `tests/interactions-v2.test.cjs`

- [ ] **Step 1: Add failing behavior tests**

```js
assert.deepEqual(reorderById(["a", "b", "c"], "c", "a", "before"), ["c", "a", "b"]);
assert.equal(inferShortcutTitle("https://chatgpt.com/"), "ChatGPT");
assert.equal(resolveSearchTarget("docs", google), "https://www.google.com/search?q=docs");
assert.equal(resolveSearchTarget("example.com", google), "https://example.com/");
```

- [ ] **Step 2: Extract pure ordering and search helpers**

```js
export function reorderById(ids, sourceId, targetId, side) {
  const next = ids.filter((id) => id !== sourceId);
  const targetIndex = next.indexOf(targetId);
  next.splice(targetIndex + (side === "after" ? 1 : 0), 0, sourceId);
  return next;
}
```

- [ ] **Step 3: Render category buttons with metadata and accessible state**

```js
button.dataset.categoryId = category.id;
button.setAttribute("aria-current", String(category.id === activeId));
button.innerHTML = `
  <span class="category-index">${String(index + 1).padStart(2, "0")}</span>
  <span class="category-icon" aria-hidden="true"></span>
  <span class="category-name"></span>
  <span class="category-count">${count}</span>`;
```

- [ ] **Step 4: Render shortcut cards without delaying navigation**

```js
card.addEventListener("click", async (event) => {
  if (event.target.closest("[data-card-menu]")) return;
  window.location.assign(shortcut.url);
  void actions.recordUse(shortcut.id);
});
```

- [ ] **Step 5: Restore long-press drag with insertion markers and auto-scroll**

Use `pointerdown`, a 500ms timer, 7px cancellation threshold, pointer capture, a lightweight ghost, and requestAnimationFrame-bounded edge scrolling. Persist order only after a valid drop.

- [ ] **Step 6: Run interaction tests and commit**

Run: `node tests/interactions-v2.test.cjs`  
Expected: `Interaction v2 tests passed`.

```bash
git add outputs/chrome-new-tab-dashboard-extension/src/ui outputs/chrome-new-tab-dashboard-extension/src/app.js tests/interactions-v2.test.cjs
git commit -m "refactor: reconnect shortcut and category workflows"
git push
```

---

### Task 7: Add Unified Dialog, Tooltip, Toast, and Focus Management

**Files:**
- Create: `outputs/chrome-new-tab-dashboard-extension/src/ui/dialogs.js`
- Create: `outputs/chrome-new-tab-dashboard-extension/src/ui/feedback.js`
- Modify: `outputs/chrome-new-tab-dashboard-extension/newtab.html`
- Extend: `tests/interactions-v2.test.cjs`

- [ ] **Step 1: Write failing modal/focus/toast tests**

```js
assert.equal(getFocusable(dialog).length, 3);
assert.equal(handleDialogKey({ key: "Escape" }, stack), "closed");
assert.equal(toastQueue.push({ type: "success", key: "saved" }).length, 1);
assert.equal(toastQueue.push({ type: "success", key: "saved" }).length, 1);
```

- [ ] **Step 2: Add a modal stack with focus restoration**

```js
export function createDialogController() {
  const stack = [];
  return {
    open(dialog, trigger) {
      stack.push({ dialog, trigger });
      dialog.showModal();
      getFocusable(dialog)[0]?.focus();
    },
    close(dialog) {
      const entry = stack.splice(stack.findIndex((item) => item.dialog === dialog), 1)[0];
      dialog.close();
      entry?.trigger?.focus();
    }
  };
}
```

- [ ] **Step 3: Replace native prompts with project dialogs**

Preset naming, deletion confirmation, category deletion, shortcut deletion, and background errors use localized modal/toast APIs. No call sites to `alert(`, `prompt(`, or `confirm(` remain.

- [ ] **Step 4: Add tooltip delegation**

```js
root.addEventListener("pointerover", (event) => {
  const target = event.target.closest("[data-tooltip-key]");
  if (target) tooltip.show(target, t(target.dataset.tooltipKey));
});
root.addEventListener("focusin", (event) => {
  const target = event.target.closest("[data-tooltip-key]");
  if (target) tooltip.show(target, t(target.dataset.tooltipKey));
});
```

- [ ] **Step 5: Run interaction/i18n tests and commit**

Run: `node tests/interactions-v2.test.cjs && node tests/i18n-v2.test.cjs`  
Expected: all pass and hard-coded native prompts count is zero.

```bash
git add outputs/chrome-new-tab-dashboard-extension/src/ui outputs/chrome-new-tab-dashboard-extension/newtab.html tests
git commit -m "feat: add accessible dialogs and feedback states"
git push
```

---

### Task 8: Implement Liquid Glass as an Independent Theme

**Files:**
- Create: `outputs/chrome-new-tab-dashboard-extension/styles/themes/liquid-glass.css`
- Extend: `tests/theme-v2.test.cjs`
- Extend: `tests/visual/capture-v2.cjs`

- [ ] **Step 1: Write failing Liquid Glass independence checks**

```js
assert.match(glass, /\[data-theme="liquid-glass"\]/);
assert.match(glass, /--radius-panel:\s*24px/);
assert.doesNotMatch(glass, /scanline|industrial-corner|terminal-tick/);
assert.match(glass, /--surface-blur:\s*18px/);
```

- [ ] **Step 2: Add separate Liquid Glass tokens**

```css
[data-theme="liquid-glass"] {
  --background-page: #09131b;
  --background-panel: rgba(22, 34, 48, 0.58);
  --background-card: rgba(255, 255, 255, 0.09);
  --background-hover: rgba(255, 255, 255, 0.15);
  --text-primary: #f7fbff;
  --text-secondary: #c6d4e2;
  --border-default: rgba(255, 255, 255, 0.24);
  --border-strong: rgba(255, 255, 255, 0.55);
  --action-primary: #8cecff;
  --radius-card: 20px;
  --radius-panel: 24px;
  --radius-control: 14px;
  --surface-blur: 18px;
  --shadow-panel: 0 24px 70px rgba(0, 0, 0, 0.36);
}
```

- [ ] **Step 3: Apply blur only to major glass surfaces and add restrained gloss**

Cards use translucent fill and edge highlights; `.app-shell`, `.category-panel`, `.command-header`, and `.customize-drawer` own backdrop filtering. Card hover uses one pseudo-element gloss sweep disabled under reduced motion.

- [ ] **Step 4: Capture and inspect Liquid Glass screenshots**

Run: `node tests/visual/capture-v2.cjs --theme liquid-glass --viewport 1440x900`  
Expected: no horizontal overflow, readable text, no Lost Starship scanline selectors active.

- [ ] **Step 5: Commit**

```bash
git add outputs/chrome-new-tab-dashboard-extension/styles/themes/liquid-glass.css tests docs/screenshots/v2
git commit -m "feat: add independent Liquid Glass theme"
git push
```

---

### Task 9: Implement Custom Theme Tokens, Undo, and Persistence

**Files:**
- Create: `outputs/chrome-new-tab-dashboard-extension/styles/themes/custom.css`
- Extend: `outputs/chrome-new-tab-dashboard-extension/src/core/theme.js`
- Extend: `tests/theme-v2.test.cjs`

- [ ] **Step 1: Add failing normalization and undo assertions**

```js
const safe = sanitizeCustomTheme({ cardRadius: 999, contentWidth: 200, cardColumns: 99, script: "bad" });
assert.equal(safe.cardRadius, 32);
assert.equal(safe.contentWidth, 960);
assert.equal(safe.cardColumns, 8);
assert.equal(Object.hasOwn(safe, "script"), false);
const draft = createThemeDraft(current);
draft.update({ accent: "#123456" });
assert.equal(draft.undo().accent, current.accent);
```

- [ ] **Step 2: Define the custom-theme whitelist and clamps**

```js
const CUSTOM_FIELDS = Object.freeze({
  backgroundPage: ["color"], backgroundPanel: ["color"], textPrimary: ["color"],
  textSecondary: ["color"], accent: ["color"], border: ["color"],
  cardRadius: ["number", 0, 32], panelRadius: ["number", 0, 36],
  cardGap: ["number", 4, 40], contentWidth: ["number", 960, 2560],
  cardColumns: ["columns", 1, 8], shadowStrength: ["number", 0, 1],
  surfaceBlur: ["number", 0, 32], surfaceOpacity: ["number", .2, 1],
  motionIntensity: ["number", 0, 1], fontScale: ["number", .85, 1.2],
  wallpaperMask: ["number", 0, .9], showGrid: ["boolean"],
  showNoise: ["boolean"], showScanlines: ["boolean"]
});
```

- [ ] **Step 3: Add live CSS-variable mapping**

```js
export function tokensToCss(theme) {
  return {
    "--background-page": theme.backgroundPage,
    "--background-panel": theme.backgroundPanel,
    "--text-primary": theme.textPrimary,
    "--text-secondary": theme.textSecondary,
    "--action-primary": theme.accent,
    "--radius-card": `${theme.cardRadius}px`,
    "--radius-panel": `${theme.panelRadius}px`,
    "--card-gap": `${theme.cardGap}px`,
    "--content-max": `${theme.contentWidth}px`,
    "--font-scale": String(theme.fontScale)
  };
}
```

- [ ] **Step 4: Test persistence and commit**

Run: `node tests/theme-v2.test.cjs`  
Expected: Custom normalization, undo, and CSS mapping pass.

```bash
git add outputs/chrome-new-tab-dashboard-extension/src/core/theme.js outputs/chrome-new-tab-dashboard-extension/styles/themes/custom.css tests/theme-v2.test.cjs
git commit -m "feat: add persistent Custom theme tokens"
git push
```

---

### Task 10: Build the Right-Side Customize Console

**Files:**
- Create: `outputs/chrome-new-tab-dashboard-extension/src/ui/customize.js`
- Modify: `outputs/chrome-new-tab-dashboard-extension/newtab.html`
- Extend: `outputs/chrome-new-tab-dashboard-extension/styles/components.css`
- Extend: `outputs/chrome-new-tab-dashboard-extension/styles/responsive.css`
- Extend: `tests/interactions-v2.test.cjs`

- [ ] **Step 1: Write drawer structure and live-draft tests**

```js
assert.deepEqual(sectionIds, ["theme", "appearance", "colors", "typography", "layout", "cards", "background", "motion", "data", "advanced"]);
controller.open();
controller.update("cardRadius", 16);
assert.equal(root.style.getPropertyValue("--radius-card"), "16px");
controller.undo();
assert.equal(root.style.getPropertyValue("--radius-card"), "0px");
```

- [ ] **Step 2: Add the drawer controller**

```js
export function createCustomizeController({ root, drawer, state, storage, theme, feedback }) {
  let openingSnapshot = null;
  return {
    open(trigger) {
      openingSnapshot = structuredClone(state.appearance);
      drawer.dataset.open = "true";
      drawer.setAttribute("aria-hidden", "false");
      drawer.querySelector("button, input, select")?.focus();
    },
    update(field, value) {
      state.appearance.customTheme = theme.patch(state.appearance.customTheme, field, value);
      theme.apply(root, state.appearance);
      storage.mirrorPreferences(state);
      storage.schedule(state);
    },
    undo() {
      state.appearance = structuredClone(openingSnapshot);
      theme.apply(root, state.appearance);
    }
  };
}
```

- [ ] **Step 3: Render ten localized sections with real theme previews**

Each control receives a label key, description key, current value output, input, and optional local reset. Theme cards render miniature toolbar/category/grid surfaces using the same theme tokens.

- [ ] **Step 4: Add desktop drawer and narrow full-screen rules**

```css
.customize-drawer { position: fixed; inset: 0 0 0 auto; width: min(720px, 48vw); transform: translateX(100%); }
.customize-drawer[data-open="true"] { transform: translateX(0); }
@media (max-width: 760px) { .customize-drawer { width: 100vw; max-width: none; } }
```

- [ ] **Step 5: Run tests, capture drawer screenshots, and commit**

Run: `node tests/interactions-v2.test.cjs --customize && node tests/visual/capture-v2.cjs --state customize`  
Expected: live preview/undo pass and drawer has no viewport overflow.

```bash
git add outputs/chrome-new-tab-dashboard-extension/src/ui/customize.js outputs/chrome-new-tab-dashboard-extension/newtab.html outputs/chrome-new-tab-dashboard-extension/styles tests docs/screenshots/v2
git commit -m "feat: rebuild Customize as a right-side console"
git push
```

---

### Task 11: Upgrade Appearance Presets and Custom-Theme Import/Export

**Files:**
- Create: `outputs/chrome-new-tab-dashboard-extension/src/core/import-export.js`
- Modify: `outputs/chrome-new-tab-dashboard-extension/src/ui/customize.js`
- Extend: `tests/preset-import.test.cjs`
- Extend: `tests/theme-v2.test.cjs`

- [ ] **Step 1: Write failing v2 envelope tests**

```js
const exported = exportCustomTheme(theme, "My Theme");
assert.equal(exported.type, "runner-shortcut-hub-custom-theme");
assert.equal(exported.version, 2);
assert.equal(Object.hasOwn(exported.theme, "script"), false);
assert.throws(() => importCustomTheme({ type: "wrong", version: 2 }), /invalidThemeFile/);
```

- [ ] **Step 2: Add strict appearance and custom-theme envelopes**

```js
export const CUSTOM_THEME_TYPE = "runner-shortcut-hub-custom-theme";
export const APPEARANCE_PRESET_TYPE = "runner-shortcut-hub-appearance-preset";

export function exportCustomTheme(theme, name) {
  return { type: CUSTOM_THEME_TYPE, version: 2, name: String(name).slice(0, 40), theme: sanitizeCustomTheme(theme) };
}
```

- [ ] **Step 3: Migrate v1 appearance imports into v2 presets**

Map old `theme` to `colorMode`, retain backgrounds/radii/font/density, set `designTheme` to `lost-starship`, and preserve name/timestamps. Missing local wallpaper paths produce a warning while other fields import.

- [ ] **Step 4: Verify duplicate names, unlimited preset save, atomic failure, and apply-now flow**

Run: `node tests/preset-import.test.cjs tests/fixtures/appearance-backup.json && node tests/theme-v2.test.cjs`  
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add outputs/chrome-new-tab-dashboard-extension/src tests
git commit -m "feat: upgrade theme and appearance preset exchange"
git push
```

---

### Task 12: Add Separate Complete-Data Backup and Restore

**Files:**
- Extend: `outputs/chrome-new-tab-dashboard-extension/src/core/import-export.js`
- Extend: `outputs/chrome-new-tab-dashboard-extension/src/core/storage.js`
- Extend: `outputs/chrome-new-tab-dashboard-extension/src/ui/customize.js`
- Create: `tests/data-backup-v2.test.cjs`

- [ ] **Step 1: Write failing full-data validation and atomicity tests**

```js
const envelope = exportFullData(state);
assert.equal(envelope.type, "runner-shortcut-hub-data-backup");
assert.equal(envelope.version, 2);
assert.deepEqual(envelope.data.categories, state.categories);
await assert.rejects(() => restoreFullData(invalid, storage));
assert.equal(JSON.stringify(storage.current), before);
```

- [ ] **Step 2: Add a strict full-data envelope**

```js
export function exportFullData(state) {
  return {
    type: "runner-shortcut-hub-data-backup",
    version: 2,
    exportedAt: new Date().toISOString(),
    data: sanitizeFullState(state)
  };
}
```

- [ ] **Step 3: Create recovery snapshot before replacement**

```js
export async function restoreFullData(envelope, storage) {
  const candidate = validateAndMigrateFullData(envelope);
  const current = await storage.read();
  await storage.writeRecovery({ createdAt: Date.now(), data: current });
  await storage.write(candidate);
  return candidate;
}
```

- [ ] **Step 4: Add clearly separated UI actions and confirmation modal**

Appearance import/export remains in Appearance Presets. Full data backup/restore appears only in Data Import/Export with explicit website/category replacement wording.

- [ ] **Step 5: Run tests and commit**

Run: `node tests/data-backup-v2.test.cjs`  
Expected: `Data backup v2 tests passed`.

```bash
git add outputs/chrome-new-tab-dashboard-extension/src tests/data-backup-v2.test.cjs
git commit -m "feat: add atomic complete data backup and restore"
git push
```

---

### Task 13: Complete Responsive, Motion, Accessibility, and Performance Checks

**Files:**
- Complete: `outputs/chrome-new-tab-dashboard-extension/styles/responsive.css`
- Complete: `outputs/chrome-new-tab-dashboard-extension/styles/animations.css`
- Create: `tests/visual/capture-v2.cjs`
- Extend: `tests/interactions-v2.test.cjs`

- [ ] **Step 1: Add failing overflow/focus/reduced-motion assertions**

For each required viewport, assert `document.documentElement.scrollWidth <= innerWidth`, every visible control rectangle stays inside the viewport, and no label has clipped scroll dimensions. Assert focus can traverse toolbar, category panel, search, grid, status bar, and drawer.

- [ ] **Step 2: Add stable responsive geometry**

```css
.app-shell { grid-template-columns: 56px minmax(220px, 288px) minmax(0, 1fr); }
.shortcut-grid { grid-template-columns: repeat(auto-fill, minmax(var(--card-min, 210px), 1fr)); }
@media (max-width: 980px) { .app-shell { grid-template-columns: 52px minmax(0, 1fr); } .category-panel { grid-column: 2; } }
@media (max-width: 640px) { .app-shell { display: block; } .shortcut-grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: Add screenshot matrix execution**

Run:

```bash
node tests/visual/capture-v2.cjs --all \
  --viewports 1280x720,1366x768,1440x900,1920x1080,2560x1440 \
  --zooms 0.8,0.9,1,1.1,1.25 \
  --themes lost-starship,liquid-glass,custom \
  --locales zh-CN,en
```

Expected: zero console errors, zero overflow failures, and screenshot files under `docs/screenshots/v2/`.

- [ ] **Step 4: Measure startup and interaction budget**

Record `performance.mark` around boot/storage/render. Assert first usable render occurs before decorative scene completion, no theme switch reads Storage, and navigation click calls location assignment before analytics/use-count persistence.

- [ ] **Step 5: Run complete test suite and commit**

Run: `node tests/migration-v2.test.cjs && node tests/theme-v2.test.cjs && node tests/i18n-v2.test.cjs && node tests/interactions-v2.test.cjs && node tests/data-backup-v2.test.cjs`  
Expected: all pass.

```bash
git add outputs/chrome-new-tab-dashboard-extension/styles tests docs/screenshots/v2
git commit -m "test: verify responsive motion and accessibility behavior"
git push
```

---

### Task 14: Version, Documentation, Package, Sync, and Final Verification

**Files:**
- Modify: `outputs/chrome-new-tab-dashboard-extension/manifest.json`
- Modify: `README.md`
- Create: `CHANGELOG.md`
- Modify: `outputs/chrome-new-tab-dashboard-extension/INSTALL.md`
- Create: `outputs/chrome-web-store-submission/runner-shortcut-hub-2.0.0.zip`

- [ ] **Step 1: Update version and documentation**

Set manifest version to `2.0.0`. Document the three themes, font licenses, Customize drawer, complete data backup, migration guarantee, screenshot gallery, installation, update, rollback, and test commands.

- [ ] **Step 2: Add CHANGELOG entry**

```markdown
## 2.0.0 - 2026-07-12

### Added
- Lost Starship, Liquid Glass, and Custom design themes.
- Right-side Customize console, custom-theme exchange, and complete data backup.

### Changed
- Modular buildless runtime, local open-source fonts, responsive shell, and accessible feedback.

### Migration
- Existing v0.5.0 categories, shortcuts, icons, order, search settings, wallpapers, and presets migrate automatically.
```

- [ ] **Step 3: Run final syntax, manifest, test, and hard-coded string checks**

Run: `node --check outputs/chrome-new-tab-dashboard-extension/app.js` plus module imports, all Node test files, `python3 -m json.tool manifest.json`, and `git diff --check`.  
Expected: all exit 0.

- [ ] **Step 4: Package and validate**

Run from the extension directory:

```bash
zip -r ../chrome-web-store-submission/runner-shortcut-hub-2.0.0.zip . -x '*.DS_Store'
unzip -t ../chrome-web-store-submission/runner-shortcut-hub-2.0.0.zip
```

Expected: `No errors detected in compressed data` and root `manifest.json` reports `2.0.0`.

- [ ] **Step 5: Back up and synchronize local extension copies without deleting Storage**

Copy the current 0.5.0 source into `outputs/runner-recovery/source-backup-before-2.0.0-<timestamp>`, then `rsync -a` the verified extension source into the stable local share and existing unpacked-extension directory. Verify manifest versions and SHA-256 hashes.

- [ ] **Step 6: Capture final before/after and theme/locale screenshots**

Ensure the screenshot directory contains the baseline, all three themes, narrow layout, Customize drawer, Chinese, and English. Include no official Marathon assets.

- [ ] **Step 7: Commit and push final delivery**

```bash
git add outputs/chrome-new-tab-dashboard-extension README.md CHANGELOG.md docs/screenshots/v2 tests
git commit -m "release: prepare Runner Shortcut Hub 2.0.0"
git push
```

- [ ] **Step 8: Report delivery status**

List changed/new files, theme architecture, typography/license handling, i18n parity, schema migration, preserved workflows, commands/tests, screenshot paths, unresolved limitations, branch name, commits, remote push, ZIP path, and the one manual Chrome Reload action if browser policy prevents automating `chrome://extensions`.
