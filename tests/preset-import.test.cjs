const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const projectRoot = path.resolve(__dirname, "..");
const extensionRoot = path.join(projectRoot, "outputs", "chrome-new-tab-dashboard-extension");
const appPath = path.join(extensionRoot, "app.js");
const htmlPath = path.join(extensionRoot, "newtab.html");
const backupPath = process.argv[2];

if (!backupPath || !fs.existsSync(backupPath)) {
  throw new Error("Pass the exported appearance backup JSON path as the first argument.");
}

const elementStub = {
  addEventListener() {},
  setAttribute() {},
  classList: { add() {}, remove() {}, toggle() {} },
  style: { setProperty() {}, removeProperty() {} }
};
const storage = new Map();
let failStorageWrites = false;
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
    documentElement: elementStub,
    body: elementStub,
    querySelector: () => ({ ...elementStub }),
    querySelectorAll: () => [],
    createElement: () => ({ ...elementStub })
  },
  window: {
    matchMedia: () => ({ matches: false, addEventListener() {} })
  },
  localStorage: {
    getItem: (key) => storage.get(key) || null,
    setItem: (key, value) => {
      if (failStorageWrites) throw new Error("quota exceeded");
      storage.set(key, value);
    }
  }
};
context.globalThis = context;
vm.createContext(context);

const appSource = fs.readFileSync(appPath, "utf8").replace(/\nboot\(\);\s*$/, "\n");
vm.runInContext(`${appSource}\n
renderCustomizerControls = () => {};
render = () => {};
globalThis.__presetTestApi = {
  readPresetFile,
  migrateImportedPreset,
  validateImportedPreset,
  sanitizeImportedPreset,
  importPreset,
  applyAppearancePreset,
  getState: () => clone(state),
  setState: (value) => { state = clone(value); },
  getDefaultState: () => clone(defaultData)
};`, context, { filename: appPath });

const api = context.__presetTestApi;

function nonAppearanceSnapshot(state) {
  return JSON.stringify({
    mode: state.mode,
    searchEngines: state.searchEngines,
    activeSearchEngineId: state.activeSearchEngineId,
    categories: state.categories,
    shortcuts: state.shortcuts,
    activeCategoryId: state.activeCategoryId
  });
}

function importEnvelope(raw) {
  const migrated = api.migrateImportedPreset(raw);
  api.validateImportedPreset(migrated);
  return api.sanitizeImportedPreset(migrated);
}

async function expectImportError(file, messageKey) {
  await assert.rejects(api.readPresetFile(file), (error) => error.messageKey === messageKey);
}

(async () => {
  const html = fs.readFileSync(htmlPath, "utf8");
  assert.match(html, /id="appearancePresetFileInput"[^>]+accept="\.json,application\/json"/);
  assert.ok(html.indexOf("importAppearancePresetBtn") < html.indexOf("saveAppearancePresetBtn"));
  assert.ok(html.indexOf("saveAppearancePresetBtn") < html.indexOf("updateAppearancePresetBtn"));

  const seed = api.getDefaultState();
  seed.appearancePresets = [{
    id: "existing-preset-1",
    name: "Preset 1",
    appearance: {
      theme: "dark",
      background: "runner-grid",
      activeCustomBackgroundId: "",
      accentColor: "#d8ff3d",
      backgroundOpacity: 1,
      backgroundBlur: 0,
      panelOpacity: 0.94,
      panelBlur: 0
    },
    createdAt: 1,
    updatedAt: 1
  }];
  seed.activeAppearancePresetId = "existing-preset-1";
  api.setState(seed);
  const nonAppearanceBefore = nonAppearanceSnapshot(api.getState());

  const legacyBackup = JSON.parse(fs.readFileSync(backupPath, "utf8"));
  const firstResult = await api.importPreset(importEnvelope(legacyBackup));
  let current = api.getState();
  assert.equal(firstResult.count, legacyBackup.appearancePresets.length);
  assert.equal(firstResult.wallpaperMissing, false);
  assert.equal(current.appearancePresets.at(-1).name, "Preset 1 (Imported)");
  assert.equal(current.activeAppearancePresetId, "existing-preset-1");
  assert.equal(current.appearance.accentColor, "#d8ff3d");
  assert.equal(nonAppearanceSnapshot(current), nonAppearanceBefore);

  await api.applyAppearancePreset(firstResult.applyPresetId);
  current = api.getState();
  assert.equal(current.activeAppearancePresetId, firstResult.applyPresetId);
  assert.equal(current.appearance.accentColor, "#5f8fd8");
  assert.equal(current.appearance.theme, "dark");
  assert.equal(current.appearance.background, "ocean");
  assert.equal(current.locale, "en");
  assert.equal(current.appearance.iconRadius, 14);
  assert.equal(current.appearance.cardRadius, 8);
  assert.equal(current.appearance.panelRadius, 12);
  assert.equal(current.appearance.buttonRadius, 6);
  assert.equal(current.appearance.fontScale, 1.08);
  assert.equal(current.appearance.cardDensity, "compact");
  assert.equal(nonAppearanceSnapshot(current), nonAppearanceBefore);
  assert.equal(JSON.parse(storage.get("shortcutDashboardData")).activeAppearancePresetId, firstResult.applyPresetId);

  await api.importPreset(importEnvelope(legacyBackup));
  current = api.getState();
  assert.equal(current.appearancePresets.at(-1).name, "Preset 1 (Imported 2)");

  const multiPreset = {
    type: "runner-shortcut-hub-appearance-preset",
    version: 1,
    activePresetId: "multi-second",
    presets: [
      { id: "multi-first", name: "Multi First", appearance: { theme: "light", accentColor: "#2f7d26" } },
      { id: "multi-second", name: "Multi Second", appearance: { theme: "system", accentColor: "#d62c86" } }
    ]
  };
  const multiResult = await api.importPreset(importEnvelope(multiPreset));
  current = api.getState();
  assert.equal(multiResult.count, 2);
  assert.deepEqual(Array.from(current.appearancePresets.slice(-2), (preset) => preset.name), ["Multi First", "Multi Second"]);
  assert.equal(current.appearancePresets.find((preset) => preset.id === multiResult.applyPresetId).name, "Multi Second");

  const missingWallpaper = {
    type: "runner-shortcut-hub-appearance-preset",
    version: 1,
    activePresetId: "missing-wallpaper",
    presets: [{
      id: "missing-wallpaper",
      name: "Missing Wallpaper",
      appearance: {
        theme: "light",
        accentColor: "#3478d4",
        background: "custom",
        activeCustomBackgroundId: "gone-file",
        backgroundOpacity: 0.7,
        backgroundBlur: 8,
        panelOpacity: 0.6,
        panelBlur: 12
      }
    }],
    backgrounds: [{ id: "gone-file", file: "/missing/wallpaper.jpg" }]
  };
  const missingResult = await api.importPreset(importEnvelope(missingWallpaper));
  current = api.getState();
  const missingPreset = current.appearancePresets.find((preset) => preset.id === missingResult.applyPresetId);
  assert.equal(missingResult.wallpaperMissing, true);
  assert.equal(missingPreset.appearance.background, "plain");
  assert.equal(missingPreset.appearance.theme, "light");
  assert.equal(missingPreset.appearance.accentColor, "#3478d4");

  const stateBeforeInvalid = JSON.stringify(api.getState());
  assert.throws(() => api.migrateImportedPreset({ type: "wrong-product", version: 1 }), (error) => error.messageKey === "invalidPresetFile");
  assert.throws(() => api.migrateImportedPreset({ type: "runner-shortcut-hub-appearance-preset", version: 99, presets: [] }), (error) => error.messageKey === "unsupportedPresetVersion");
  assert.equal(JSON.stringify(api.getState()), stateBeforeInvalid);

  await expectImportError({ name: "empty.json", type: "application/json", size: 0, text: async () => "" }, "presetFileEmpty");
  await expectImportError({ name: "large.json", type: "application/json", size: 5 * 1024 * 1024 + 1, text: async () => "{}" }, "presetFileTooLarge");
  await expectImportError({ name: "broken.json", type: "application/json", size: 4, text: async () => "nope" }, "invalidPresetFile");
  await expectImportError({ name: "read.json", type: "application/json", size: 4, text: async () => { throw new Error("read"); } }, "presetReadFailed");

  const validCanonical = importEnvelope({
    type: "runner-shortcut-hub-appearance-preset",
    version: 1,
    preset: {
      id: "atomic-test",
      name: "Atomic Test",
      appearance: { theme: "system", accentColor: "#d14b1f", script: "never-run" }
    }
  });
  assert.equal(Object.hasOwn(validCanonical.presets[0].appearance, "script"), false);
  const beforeFailedWrite = JSON.stringify(api.getState());
  failStorageWrites = true;
  await assert.rejects(api.importPreset(validCanonical), (error) => error.messageKey === "storageWriteFailed");
  failStorageWrites = false;
  assert.equal(JSON.stringify(api.getState()), beforeFailedWrite);

  console.log("Preset import tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
