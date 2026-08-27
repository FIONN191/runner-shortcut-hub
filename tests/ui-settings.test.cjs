const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const projectRoot = path.resolve(__dirname, "..");
const extensionRoot = path.join(projectRoot, "outputs", "chrome-new-tab-dashboard-extension");
const appPath = path.join(extensionRoot, "app.js");
const htmlPath = path.join(extensionRoot, "newtab.html");
const cssPath = path.join(extensionRoot, "styles.css");
const appSource = fs.readFileSync(appPath, "utf8");

const styleValues = new Map();
const makeElement = () => ({
  addEventListener() {},
  setAttribute() {},
  removeAttribute() {},
  replaceChildren() {},
  append() {},
  querySelector: () => makeElement(),
  querySelectorAll: () => [],
  classList: { add() {}, remove() {}, toggle() {} },
  style: {
    setProperty(name, value) { styleValues.set(name, value); },
    removeProperty(name) { styleValues.delete(name); }
  },
  dataset: {},
  childNodes: [],
  open: false,
  hidden: false,
  value: ""
});

const localStorageValues = new Map();
const body = makeElement();
const bodyClassNames = new Set();
body.classList = {
  add: (...names) => names.forEach((name) => bodyClassNames.add(name)),
  remove: (...names) => names.forEach((name) => bodyClassNames.delete(name)),
  toggle: (name, force) => {
    const shouldAdd = force === undefined ? !bodyClassNames.has(name) : Boolean(force);
    if (shouldAdd) bodyClassNames.add(name);
    else bodyClassNames.delete(name);
    return shouldAdd;
  },
  contains: (name) => bodyClassNames.has(name)
};
const context = {
  console,
  structuredClone,
  crypto: webcrypto,
  atob,
  btoa,
  URL,
  Blob,
  File: globalThis.File,
  setTimeout,
  clearTimeout,
  Intl,
  Date,
  Node: { TEXT_NODE: 3 },
  document: {
    documentElement: makeElement(),
    body,
    querySelector: () => makeElement(),
    querySelectorAll: () => [],
    createElement: () => makeElement()
  },
  window: {
    matchMedia: () => ({ matches: false, addEventListener() {} })
  },
  localStorage: {
    getItem: (key) => localStorageValues.get(key) || null,
    setItem: (key, value) => localStorageValues.set(key, value)
  }
};
context.globalThis = context;
vm.createContext(context);

const sourceWithoutBoot = appSource.replace(/\nboot\(\);\s*$/, "\n");
vm.runInContext(`${sourceWithoutBoot}\n
writeDataSnapshot = async (data) => { globalThis.__lastSnapshot = clone(data); };
render = () => {};
closeResetAppearanceDialog = () => {};
globalThis.__uiTestApi = {
  translations,
  normalizeLocale,
  normalizeAppearance,
  compactAppearanceSnapshot,
  createUiPreferences,
  mergeUiPreferences,
  applyAppearance,
  createAppearancePreset,
  categoryIcon,
  isDialogBackdropClick,
  normalizeState,
  categoriesForDisplay,
  shortcutsForDisplay,
  findSavedShortcuts,
  savedShortcutMatchRank,
  accessibleAccentText,
  bestContrastingText,
  createAccentEffects,
  contrastRatio,
  recordShortcutUse,
  resetAppearance,
  getState: () => clone(state),
  setState: (value) => { state = clone(value); },
  getDefaultState: () => clone(defaultData),
  translate: (locale, key) => {
    state.locale = normalizeLocale(locale);
    return t(key);
  }
};`, context, { filename: appPath });

const api = context.__uiTestApi;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nonAppearanceSnapshot(state) {
  return JSON.stringify({
    mode: state.mode,
    searchEngines: state.searchEngines,
    activeSearchEngineId: state.activeSearchEngineId,
    searchHistory: state.searchHistory,
    showSearchHistory: state.showSearchHistory,
    sortShortcutsByUsage: state.sortShortcutsByUsage,
    categories: state.categories,
    shortcuts: state.shortcuts,
    activeCategoryId: state.activeCategoryId
  });
}

(async () => {
  const defaults = api.getDefaultState();
  assert.equal(defaults.locale, "zh-CN");
  assert.equal(defaults.sortShortcutsByUsage, false);
  assert.equal(defaults.appearance.cornerAccentsEnabled, false);
  assert.equal(api.normalizeLocale("zh"), "zh-CN");
  assert.equal(api.normalizeLocale("zhCN"), "zh-CN");
  assert.equal(api.normalizeLocale("en"), "en");
  assert.equal(api.translate("zh-CN", "customize"), "自定义");
  assert.equal(api.translate("en", "customize"), "Customize");
  assert.equal(api.translate("zh-CN", "sortShortcutsByUsage"), "分类和网站按使用频次排序");
  assert.equal(api.translate("en", "sortShortcutsByUsage"), "Sort Categories and Websites by Usage");
  assert.equal(api.translate("zh-CN", "cornerAccents"), "L 形直角装饰线");
  assert.equal(api.translate("en", "cornerAccents"), "L-shaped Corner Accents");

  const customizeDialog = {
    getBoundingClientRect: () => ({ left: 600, right: 1280, top: 0, bottom: 800 })
  };
  assert.equal(
    api.isDialogBackdropClick({ target: customizeDialog, clientX: 420, clientY: 400 }, customizeDialog),
    true,
    "a click on the dimmed area to the left should be treated as a backdrop click"
  );
  assert.equal(
    api.isDialogBackdropClick({ target: customizeDialog, clientX: 700, clientY: 400 }, customizeDialog),
    false,
    "a click inside the Customize drawer must not close it"
  );
  assert.equal(
    api.isDialogBackdropClick({ target: {}, clientX: 420, clientY: 400 }, customizeDialog),
    false,
    "a click originating from a child control must not be treated as a backdrop click"
  );
  assert.equal(
    api.isDialogBackdropClick({ target: customizeDialog, clientX: 600, clientY: 0 }, customizeDialog),
    false,
    "the drawer boundary belongs to the dialog, not the backdrop"
  );
  api.translate("zh-CN", "customize");
  assert.equal(api.categoryIcon({ id: "video", name: "视频创作", icon: "影" }), "影");
  api.translate("en", "customize");
  assert.equal(api.categoryIcon({ id: "video", name: "视频创作", icon: "影" }), "VI");
  assert.equal(api.categoryIcon({ id: "video", name: "My Video", icon: "MV" }), "MV");

  const zhKeys = Object.keys(api.translations["zh-CN"]).sort();
  const enKeys = Object.keys(api.translations.en).sort();
  assert.deepEqual(zhKeys, enKeys, "Chinese and English dictionaries must expose identical keys");
  const staticTranslationKeys = Array.from(appSource.matchAll(/\bt\(\s*["']([^"']+)["']/g), (match) => match[1]);
  staticTranslationKeys.forEach((key) => {
    assert.ok(Object.hasOwn(api.translations["zh-CN"], key), `Missing zh-CN translation: ${key}`);
    assert.ok(Object.hasOwn(api.translations.en, key), `Missing English translation: ${key}`);
  });

  const usageState = clone(defaults);
  usageState.activeCategoryId = "ai-tools";
  usageState.categories = [
    { id: "ai-tools", name: "AI Tools", icon: "AI", order: 0, useCount: 1 },
    { id: "popular-a", name: "Popular A", icon: "A", order: 1, useCount: 8 },
    { id: "popular-b", name: "Popular B", icon: "B", order: 2, useCount: 8 },
    { id: "common", name: "Common", icon: "+", order: 3, useCount: 0 },
    { id: "custom", name: "Custom", icon: "+", order: 4, useCount: 0 }
  ];
  usageState.shortcuts = [
    { id: "manual-first", categoryId: "ai-tools", title: "First", url: "https://first.example", useCount: 1 },
    { id: "popular-first", categoryId: "ai-tools", title: "Popular A", url: "https://a.example", useCount: 8 },
    { id: "popular-second", categoryId: "ai-tools", title: "Popular B", url: "https://b.example", useCount: 8 }
  ];
  usageState.sortShortcutsByUsage = false;
  api.setState(api.normalizeState(usageState));
  assert.deepEqual(
    Array.from(api.categoriesForDisplay(), (category) => category.id),
    ["ai-tools", "popular-a", "popular-b", "common", "custom"],
    "manual category order should be retained while usage sorting is disabled"
  );
  assert.deepEqual(
    Array.from(api.shortcutsForDisplay("ai-tools"), (shortcut) => shortcut.id),
    ["manual-first", "popular-first", "popular-second"],
    "manual order should be retained while usage sorting is disabled"
  );

  usageState.sortShortcutsByUsage = true;
  api.setState(api.normalizeState(usageState));
  assert.deepEqual(
    Array.from(api.categoriesForDisplay(), (category) => category.id),
    ["popular-a", "popular-b", "ai-tools", "common", "custom"],
    "category usage sorting should be descending and stable for ties"
  );
  assert.deepEqual(
    Array.from(api.shortcutsForDisplay("ai-tools"), (shortcut) => shortcut.id),
    ["popular-first", "popular-second", "manual-first"],
    "usage sorting should be descending and stable for ties"
  );
  await api.recordShortcutUse("manual-first");
  const incrementedState = api.getState();
  assert.equal(incrementedState.shortcuts.find((shortcut) => shortcut.id === "manual-first").useCount, 2);
  assert.equal(incrementedState.categories.find((category) => category.id === "ai-tools").useCount, 2);
  assert.deepEqual(
    Array.from(incrementedState.categories, (category) => category.order),
    [0, 1, 2, 3, 4],
    "usage tracking must not overwrite the saved manual category order"
  );
  assert.equal(context.__lastSnapshot.sortShortcutsByUsage, true);

  const finderState = api.getDefaultState();
  finderState.locale = "en";
  finderState.categories = [
    { id: "tools", name: "Tools", icon: "TO", order: 0, useCount: 0 },
    { id: "video", name: "Video", icon: "VI", order: 1, useCount: 0 },
    { id: "fotor-category", name: "Fotor Resources", icon: "FO", order: 2, useCount: 0 }
  ];
  finderState.shortcuts = [
    { id: "exact", categoryId: "tools", title: "Fotor", url: "https://www.fotor.com/", useCount: 1 },
    { id: "prefix", categoryId: "tools", title: "Fotor Editor", url: "https://editor.example.com/", useCount: 3 },
    { id: "contains-low", categoryId: "video", title: "AI Fotor Lab", url: "https://low.example.com/", useCount: 2 },
    { id: "contains-high", categoryId: "video", title: "Best Fotor Tools", url: "https://high.example.com/", useCount: 20 },
    { id: "host", categoryId: "tools", title: "Design Tool", url: "https://fotor.example.com/", useCount: 5 },
    { id: "category", categoryId: "fotor-category", title: "Reference Library", url: "https://library.example.com/", useCount: 8 },
    { id: "invalid", categoryId: "tools", title: "Broken Fotor", url: "javascript:alert(1)", useCount: 100 }
  ];
  finderState.sortShortcutsByUsage = false;
  api.setState(finderState);
  assert.deepEqual(
    Array.from(api.findSavedShortcuts("fotor"), (result) => result.shortcutId),
    ["exact", "prefix", "contains-low", "contains-high", "host", "category"],
    "saved-site search should rank exact, prefix, title, host, and category matches"
  );
  assert.deepEqual(
    Array.from(api.findSavedShortcuts("video"), (result) => result.shortcutId),
    ["contains-low", "contains-high"],
    "displayed category names should be searchable"
  );
  assert.deepEqual(Array.from(api.findSavedShortcuts("")), [], "an empty query should not reveal saved sites");

  finderState.sortShortcutsByUsage = true;
  api.setState(finderState);
  assert.deepEqual(
    Array.from(api.findSavedShortcuts("fotor"), (result) => result.shortcutId),
    ["exact", "prefix", "contains-high", "contains-low", "host", "category"],
    "usage sorting should only reorder results within the same relevance rank"
  );
  assert.equal(
    api.savedShortcutMatchRank("fotor", {
      title: "Other",
      host: "example.com",
      url: "https://example.com/fotor/start",
      categoryName: "Tools"
    }),
    4,
    "full URLs should be searchable"
  );

  const normalizedCircle = api.normalizeAppearance({
    ...defaults.appearance,
    iconRadius: 50,
    iconRadiusUnit: "percent",
    cardRadius: 99,
    panelRadius: -4,
    buttonRadius: 9,
    cornerAccentsEnabled: true,
    fontScale: 1.08,
    cardDensity: "compact"
  });
  assert.equal(normalizedCircle.iconRadius, 50);
  assert.equal(normalizedCircle.iconRadiusUnit, "percent");
  assert.equal(normalizedCircle.cardRadius, 24);
  assert.equal(normalizedCircle.panelRadius, 0);
  assert.equal(normalizedCircle.buttonRadius, 9);
  assert.equal(normalizedCircle.cornerAccentsEnabled, true);
  assert.equal(normalizedCircle.fontScale, 1.08);
  assert.equal(normalizedCircle.cardDensity, "compact");

  const stateWithAppearance = api.getDefaultState();
  stateWithAppearance.appearance = {
    ...normalizedCircle,
    theme: "light",
    accentColor: "#f8ff4a"
  };
  api.setState(stateWithAppearance);
  styleValues.clear();
  bodyClassNames.clear();
  api.applyAppearance();
  assert.equal(styleValues.get("--icon-radius"), "50%");
  assert.equal(styleValues.get("--card-radius"), "24px");
  assert.equal(styleValues.get("--panel-radius"), "0px");
  assert.equal(styleValues.get("--button-radius"), "9px");
  assert.equal(styleValues.get("--font-scale"), "1.08");
  assert.equal(styleValues.get("--on-accent"), "#050505");
  assert.equal(styleValues.get("--accent"), "rgb(248 255 74)");
  assert.equal(styleValues.get("--accent-cyan"), "rgb(248 255 74)");
  assert.equal(styleValues.get("--focus-ring"), "rgb(248 255 74)");
  assert.equal(styleValues.get("--background-hover"), "rgb(248 255 74 / 14%)");
  assert.equal(styleValues.get("--border-strong"), "rgb(248 255 74 / 72%)");
  assert.equal(styleValues.get("--action-primary"), "rgb(248 255 74)");
  assert.ok(
    api.contrastRatio(api.accessibleAccentText([248, 255, 74], "light"), [248, 250, 245]) >= 4.5,
    "light-mode accent text must meet the WCAG AA contrast target"
  );
  assert.equal(bodyClassNames.has("show-corner-accents"), true);
  assert.equal(body.dataset.cardDensity, "compact");

  const darkEffects = api.createAccentEffects([52, 120, 212], "dark");
  assert.equal(darkEffects.soft, "rgb(52 120 212 / 10%)");
  assert.equal(darkEffects.hover, "rgb(52 120 212 / 16%)");
  assert.equal(darkEffects.active, "rgb(52 120 212 / 24%)");

  const minimalState = api.getState();
  minimalState.appearance.designTheme = "minimal";
  minimalState.appearance.accentColor = "#3478d4";
  api.setState(minimalState);
  styleValues.clear();
  api.applyAppearance();
  assert.equal(styleValues.get("--accent"), "rgb(222 222 222)");
  assert.equal(styleValues.get("--accent-cyan"), "rgb(222 222 222)");
  assert.equal(styleValues.get("--focus-ring"), "rgb(222 222 222)");

  const preset = api.createAppearancePreset("Shape Preset");
  assert.equal(preset.locale, "zh-CN");
  assert.equal(preset.appearance.iconRadius, 50);
  assert.equal(preset.appearance.iconRadiusUnit, "percent");
  assert.equal(preset.appearance.cardRadius, 24);
  assert.equal(preset.appearance.buttonRadius, 9);
  assert.equal(preset.appearance.cornerAccentsEnabled, true);
  assert.equal(preset.appearance.fontScale, 1.08);
  assert.equal(preset.appearance.cardDensity, "compact");

  const squareCardState = api.getState();
  squareCardState.appearance.cardRadius = 0;
  api.setState(squareCardState);
  api.applyAppearance();
  assert.equal(bodyClassNames.has("show-corner-accents"), true);

  const hiddenCornerState = api.getState();
  hiddenCornerState.appearance.cornerAccentsEnabled = false;
  api.setState(hiddenCornerState);
  api.applyAppearance();
  assert.equal(bodyClassNames.has("show-corner-accents"), false);

  const backgroundImage = { id: "bg-1", image: "data:image/png;base64,AA==", accentColor: "#335577" };
  const stateForPreferences = api.getDefaultState();
  stateForPreferences.locale = "en";
  stateForPreferences.appearance = {
    ...stateForPreferences.appearance,
    theme: "light",
    iconRadius: 14,
    cornerAccentsEnabled: true,
    customBackgroundImages: [backgroundImage],
    activeCustomBackgroundId: "bg-1",
    background: "custom"
  };
  const preferences = api.createUiPreferences(stateForPreferences);
  assert.equal(preferences.locale, "en");
  assert.equal(preferences.appearance.iconRadius, 14);
  assert.equal(preferences.appearance.cornerAccentsEnabled, true);
  assert.equal(Object.hasOwn(preferences.appearance, "customBackgroundImages"), false);
  assert.doesNotMatch(JSON.stringify(preferences), /data:image/);

  const storageState = api.getDefaultState();
  storageState.appearance.customBackgroundImages = [backgroundImage];
  const merged = api.mergeUiPreferences(storageState, preferences);
  assert.equal(merged.locale, "en");
  assert.equal(merged.appearance.theme, "light");
  assert.equal(merged.appearance.iconRadius, 14);
  assert.equal(merged.appearance.cornerAccentsEnabled, true);
  assert.equal(merged.appearance.customBackgroundImages.length, 1);
  assert.equal(merged.appearance.customBackgroundImages[0].id, backgroundImage.id);
  assert.equal(merged.appearance.customBackgroundImages[0].image, backgroundImage.image);

  const resetSeed = api.getDefaultState();
  resetSeed.locale = "en";
  resetSeed.mode = "classic";
  resetSeed.appearance = {
    ...resetSeed.appearance,
    theme: "light",
    accentColor: "#123456",
    background: "custom",
    customBackgroundImages: [backgroundImage],
    activeCustomBackgroundId: "bg-1",
    iconRadius: 50,
    iconRadiusUnit: "percent",
    cardRadius: 20,
    panelRadius: 18,
    buttonRadius: 12,
    cornerAccentsEnabled: true,
    fontScale: 1.2,
    cardDensity: "spacious"
  };
  resetSeed.activeAppearancePresetId = "saved-preset";
  const beforeReset = nonAppearanceSnapshot(resetSeed);
  api.setState(resetSeed);
  await api.resetAppearance();
  const resetState = api.getState();
  assert.equal(nonAppearanceSnapshot(resetState), beforeReset);
  assert.equal(resetState.locale, "zh-CN");
  assert.equal(resetState.appearance.theme, "dark");
  assert.equal(resetState.appearance.iconRadius, 8);
  assert.equal(resetState.appearance.iconRadiusUnit, "px");
  assert.equal(resetState.appearance.cardRadius, 0);
  assert.equal(resetState.appearance.cornerAccentsEnabled, false);
  assert.equal(resetState.appearance.fontScale, 1);
  assert.equal(resetState.appearance.cardDensity, "comfortable");
  assert.equal(resetState.activeAppearancePresetId, "");
  assert.equal(resetState.appearance.customBackgroundImages.length, 1);
  assert.equal(resetState.appearance.customBackgroundImages[0].id, backgroundImage.id);
  assert.equal(resetState.appearance.customBackgroundImages[0].image, backgroundImage.image);

  const html = fs.readFileSync(htmlPath, "utf8");
  const css = fs.readFileSync(cssPath, "utf8");
  [
    "RUNNER / OPS",
    ">QUERY<",
    ">EXEC<",
    ">SIGNAL<",
    ">CLUSTERS<",
    "SURFACE DATA // ACTIVE PANEL",
    ">Chrome Original<",
    ">Customize<",
    ">Edit Categories<",
    ">Add Website<"
  ].forEach((text) => assert.equal(html.includes(text), false, `Hard-coded functional copy remains: ${text}`));
  assert.equal((html.match(/\bnovalidate\b/g) || []).length, 3);
  assert.doesNotMatch(appSource, /\.title\s*=\s*["'](?:编辑|Edit|关闭|Close)["']/);
  assert.match(css, /--icon-radius:\s*8px/);
  assert.match(css, /\.category-icon[\s\S]*?border-radius:\s*var\(--icon-radius\)/);
  assert.match(css, /\.shortcut-icon[\s\S]*?border-radius:\s*var\(--icon-radius\)/);
  assert.match(css, /\.search-result-icon[\s\S]*?border-radius:\s*var\(--icon-radius\)/);
  assert.match(css, /\.shape-preview-icon[\s\S]*?border-radius:\s*var\(--icon-radius\)/);
  assert.match(css, /\.appearance-preview-icon[\s\S]*?border-radius:\s*var\(--icon-radius\)/);
  assert.match(css, /\.setting-switch\s*\{[\s\S]*?min-height:\s*26px/);
  assert.match(css, /\.setting-switch\s*\{[\s\S]*?padding:\s*0/);
  assert.match(css, /\.setting-switch\s*\{[\s\S]*?overflow:\s*hidden/);

  console.log("UI settings and i18n tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
