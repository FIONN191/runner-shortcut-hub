import { defaultAppearanceV2, SCHEMA_VERSION } from "./defaults.js";

const DESIGN_THEMES = new Set(["lost-starship", "liquid-glass", "custom"]);
const COLOR_MODES = new Set(["dark", "light", "system"]);
const CARD_SIZES = new Set(["small", "medium", "large"]);
const DENSITIES = new Set(["compact", "comfortable", "spacious"]);

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneValue(value, seen = new WeakMap()) {
  if (!value || typeof value !== "object") return value;
  if (seen.has(value)) return seen.get(value);
  if (value instanceof Date) return new Date(value.getTime());

  const copy = Array.isArray(value) ? [] : {};
  seen.set(value, copy);
  Object.keys(value).forEach((key) => {
    Object.defineProperty(copy, key, {
      configurable: true,
      enumerable: true,
      value: cloneValue(value[key], seen),
      writable: true
    });
  });
  return copy;
}

function normalizeChoice(value, choices, fallback) {
  return choices.has(value) ? value : fallback;
}

function normalizeText(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function toFiniteNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || !value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeNumber(value, min, max, fallback) {
  const number = toFiniteNumber(value);
  if (number === null) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeColumns(value, fallback) {
  if (value === "auto") return value;
  const number = toFiniteNumber(value);
  if (number === null) return fallback;
  return Math.round(Math.min(8, Math.max(1, number)));
}

function normalizeBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}

function legacyCustomThemeFallback(appearance) {
  const defaults = defaultAppearanceV2.customTheme;
  return {
    ...defaults,
    accent: normalizeText(appearance.accentColor, defaults.accent),
    cardRadius: normalizeNumber(appearance.cardRadius, 0, 32, defaults.cardRadius),
    panelRadius: normalizeNumber(appearance.panelRadius, 0, 36, defaults.panelRadius),
    surfaceBlur: normalizeNumber(appearance.panelBlur, 0, 36, defaults.surfaceBlur),
    surfaceOpacity: normalizeNumber(appearance.panelOpacity, 0.1, 1, defaults.surfaceOpacity),
    fontScale: normalizeNumber(appearance.fontScale, 0.85, 1.2, defaults.fontScale),
    density: normalizeChoice(appearance.cardDensity, DENSITIES, defaults.density)
  };
}

function normalizeCustomTheme(customTheme, appearance) {
  const source = isRecord(customTheme) ? customTheme : {};
  const fallback = legacyCustomThemeFallback(appearance);
  return {
    ...fallback,
    ...source,
    backgroundPage: normalizeText(source.backgroundPage, fallback.backgroundPage),
    backgroundPanel: normalizeText(source.backgroundPanel, fallback.backgroundPanel),
    textPrimary: normalizeText(source.textPrimary, fallback.textPrimary),
    textSecondary: normalizeText(source.textSecondary, fallback.textSecondary),
    accent: normalizeText(source.accent, fallback.accent),
    border: normalizeText(source.border, fallback.border),
    cardRadius: normalizeNumber(source.cardRadius, 0, 32, fallback.cardRadius),
    panelRadius: normalizeNumber(source.panelRadius, 0, 36, fallback.panelRadius),
    cardGap: normalizeNumber(source.cardGap, 4, 40, fallback.cardGap),
    contentWidth: normalizeNumber(source.contentWidth, 960, 2560, fallback.contentWidth),
    cardColumns: normalizeColumns(source.cardColumns, fallback.cardColumns),
    cardSize: normalizeChoice(source.cardSize, CARD_SIZES, fallback.cardSize),
    shadowStrength: normalizeNumber(source.shadowStrength, 0, 1, fallback.shadowStrength),
    surfaceBlur: normalizeNumber(source.surfaceBlur, 0, 36, fallback.surfaceBlur),
    surfaceOpacity: normalizeNumber(source.surfaceOpacity, 0.1, 1, fallback.surfaceOpacity),
    motionIntensity: normalizeNumber(source.motionIntensity, 0, 1, fallback.motionIntensity),
    fontScale: normalizeNumber(source.fontScale, 0.85, 1.2, fallback.fontScale),
    density: normalizeChoice(source.density, DENSITIES, fallback.density),
    showGrid: normalizeBoolean(source.showGrid, fallback.showGrid),
    showNoise: normalizeBoolean(source.showNoise, fallback.showNoise),
    showScanlines: normalizeBoolean(source.showScanlines, fallback.showScanlines),
    wallpaperMask: normalizeNumber(source.wallpaperMask, 0, 0.9, fallback.wallpaperMask)
  };
}

function normalizeClonedState(source) {
  const appearance = isRecord(source.appearance) ? source.appearance : {};
  const legacyColorMode = normalizeChoice(
    appearance.theme,
    COLOR_MODES,
    defaultAppearanceV2.colorMode
  );

  return {
    ...source,
    schemaVersion: SCHEMA_VERSION,
    appearance: {
      ...appearance,
      designTheme: normalizeChoice(
        appearance.designTheme,
        DESIGN_THEMES,
        defaultAppearanceV2.designTheme
      ),
      colorMode: normalizeChoice(appearance.colorMode, COLOR_MODES, legacyColorMode),
      customTheme: normalizeCustomTheme(appearance.customTheme, appearance)
    }
  };
}

export function normalizeStateV2(raw) {
  const source = isRecord(raw) ? cloneValue(raw) : {};
  return normalizeClonedState(source);
}

export function migrateStateV2(raw) {
  return normalizeStateV2(raw);
}

export { defaultAppearanceV2, SCHEMA_VERSION };
