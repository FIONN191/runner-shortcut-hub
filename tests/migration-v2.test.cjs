const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const coreRoot = path.join(projectRoot, "outputs", "chrome-new-tab-dashboard-extension", "src", "core");
const fixturesRoot = path.join(__dirname, "fixtures");

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(fixturesRoot, fileName), "utf8"));
}

function moduleUrl(source) {
  return `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
}

async function loadMigrationModule() {
  const defaultsSource = fs.readFileSync(path.join(coreRoot, "defaults.js"), "utf8");
  const defaultsUrl = moduleUrl(defaultsSource);
  const migrationSource = fs
    .readFileSync(path.join(coreRoot, "migration.js"), "utf8")
    .replace("./defaults.js", defaultsUrl);
  return import(moduleUrl(migrationSource));
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
}

(async () => {
  const { defaultAppearanceV2, migrateStateV2, SCHEMA_VERSION } = await loadMigrationModule();
  const v1 = deepFreeze(readJson("storage-v1-complete.json"));
  const expectedV2 = readJson("storage-v2-complete.json");
  const originalJson = JSON.stringify(v1);

  assert.equal(SCHEMA_VERSION, 2);
  assert.equal(Object.isFrozen(defaultAppearanceV2), true);
  assert.equal(Object.isFrozen(defaultAppearanceV2.customTheme), true);

  const migrated = migrateStateV2(v1);
  assert.deepEqual(migrated, expectedV2);
  assert.equal(migrated.schemaVersion, 2);
  assert.equal(migrated.appearance.designTheme, "lost-starship");
  assert.equal(migrated.appearance.colorMode, v1.appearance.theme);

  [
    "categories",
    "shortcuts",
    "searchHistory",
    "searchEngines",
    "appearancePresets"
  ].forEach((field) => assert.deepEqual(migrated[field], v1[field], `${field} changed during migration`));
  assert.deepEqual(migrated.appearance.customBackgroundImages, v1.appearance.customBackgroundImages);
  assert.equal(migrated.activeCategoryId, v1.activeCategoryId);
  assert.equal(migrated.activeSearchEngineId, v1.activeSearchEngineId);
  assert.equal(migrated.activeAppearancePresetId, v1.activeAppearancePresetId);
  assert.equal(migrated.appearance.activeCustomBackgroundId, v1.appearance.activeCustomBackgroundId);
  assert.deepEqual(
    migrated.categories.map(({ order, useCount }) => ({ order, useCount })),
    v1.categories.map(({ order, useCount }) => ({ order, useCount }))
  );
  assert.equal(migrated.shortcuts[0].iconUrl, v1.shortcuts[0].iconUrl);
  assert.equal(migrated.appearance.customBackgroundImages[0].image, v1.appearance.customBackgroundImages[0].image);

  const expectedMappings = {
    accent: "accentColor",
    cardRadius: "cardRadius",
    panelRadius: "panelRadius",
    fontScale: "fontScale",
    density: "cardDensity",
    surfaceBlur: "panelBlur",
    surfaceOpacity: "panelOpacity"
  };
  Object.entries(expectedMappings).forEach(([nextField, legacyField]) => {
    assert.equal(migrated.appearance.customTheme[nextField], v1.appearance[legacyField]);
  });

  Object.keys(v1.appearance).forEach((field) => {
    assert.deepEqual(migrated.appearance[field], v1.appearance[field], `legacy appearance.${field} was not retained`);
  });
  assert.equal(JSON.stringify(v1), originalJson);
  assert.notStrictEqual(migrated, v1);
  assert.notStrictEqual(migrated.categories, v1.categories);
  assert.notStrictEqual(migrated.appearance, v1.appearance);
  assert.notStrictEqual(migrated.appearance.customBackgroundImages, v1.appearance.customBackgroundImages);

  const migratedAgain = migrateStateV2(migrated);
  assert.deepEqual(migratedAgain, migrated);
  assert.notStrictEqual(migratedAgain, migrated);
  assert.notStrictEqual(migratedAgain.appearance.customTheme, migrated.appearance.customTheme);

  const legacyLimits = migrateStateV2({
    appearance: { panelBlur: 36, panelOpacity: 0.1 }
  });
  assert.equal(legacyLimits.appearance.customTheme.surfaceBlur, 36);
  assert.equal(legacyLimits.appearance.customTheme.surfaceOpacity, 0.1);
  assert.deepEqual(migrateStateV2(legacyLimits), legacyLimits);

  const unrelatedData = {
    categories: [{ id: "future-category", payload: { keep: true } }],
    futureFeature: { enabled: true, values: [1, 2, 3] }
  };
  const malformed = {
    schemaVersion: "2",
    appearance: {
      theme: "light",
      designTheme: "unknown-theme",
      colorMode: "sepia",
      customTheme: {
        cardRadius: "wide",
        panelRadius: -5,
        cardGap: null,
        contentWidth: 9000,
        cardColumns: 99,
        cardSize: "huge",
        shadowStrength: -1,
        surfaceBlur: "blurred",
        surfaceOpacity: 4,
        motionIntensity: 3,
        fontScale: 0.2,
        density: "packed",
        showGrid: "yes",
        showNoise: false,
        showScanlines: 0,
        wallpaperMask: 2,
        futureToken: { keep: "me" }
      },
      futureAppearance: { keep: "also" }
    },
    ...unrelatedData
  };
  const normalized = migrateStateV2(malformed);
  assert.equal(normalized.schemaVersion, 2);
  assert.equal(normalized.appearance.designTheme, "lost-starship");
  assert.equal(normalized.appearance.colorMode, "light");
  assert.equal(normalized.appearance.customTheme.cardRadius, 0);
  assert.equal(normalized.appearance.customTheme.panelRadius, 0);
  assert.equal(normalized.appearance.customTheme.cardGap, 12);
  assert.equal(normalized.appearance.customTheme.contentWidth, 2560);
  assert.equal(normalized.appearance.customTheme.cardColumns, 8);
  assert.equal(normalized.appearance.customTheme.cardSize, "medium");
  assert.equal(normalized.appearance.customTheme.shadowStrength, 0);
  assert.equal(normalized.appearance.customTheme.surfaceBlur, 0);
  assert.equal(normalized.appearance.customTheme.surfaceOpacity, 1);
  assert.equal(normalized.appearance.customTheme.motionIntensity, 1);
  assert.equal(normalized.appearance.customTheme.fontScale, 0.85);
  assert.equal(normalized.appearance.customTheme.density, "comfortable");
  assert.equal(normalized.appearance.customTheme.showGrid, true);
  assert.equal(normalized.appearance.customTheme.showNoise, false);
  assert.equal(normalized.appearance.customTheme.showScanlines, true);
  assert.equal(normalized.appearance.customTheme.wallpaperMask, 0.9);
  assert.deepEqual(normalized.appearance.customTheme.futureToken, { keep: "me" });
  assert.deepEqual(normalized.appearance.futureAppearance, { keep: "also" });
  assert.deepEqual(normalized.categories, unrelatedData.categories);
  assert.deepEqual(normalized.futureFeature, unrelatedData.futureFeature);

  const missing = migrateStateV2({ futureFeature: { keep: true } });
  assert.equal(missing.schemaVersion, 2);
  assert.deepEqual(missing.appearance, defaultAppearanceV2);
  assert.deepEqual(missing.futureFeature, { keep: true });
  assert.deepEqual(migrateStateV2(null).appearance, defaultAppearanceV2);

  console.log("Migration v2 tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
