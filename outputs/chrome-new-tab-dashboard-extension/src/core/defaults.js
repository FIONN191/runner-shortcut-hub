function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

export const SCHEMA_VERSION = 2;

export const defaultAppearanceV2 = deepFreeze({
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
