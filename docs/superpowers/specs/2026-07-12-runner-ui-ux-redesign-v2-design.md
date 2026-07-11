# Runner Shortcut Hub UI/UX Redesign v2

**Date:** 2026-07-12  
**Status:** Approved  
**Branch:** `redesign/lost-starship-ui-v2`  
**Target version:** `2.0.0`

## 1. Purpose

Rebuild the Runner Shortcut Hub Chrome new-tab experience around a coherent design system with three first-class visual themes: Lost Starship, Liquid Glass, and Custom. The redesign must preserve every existing user-owned category, shortcut, icon, order, search setting, appearance preset, and background image.

The visual direction studies the structure, contrast, typography rhythm, asymmetric grids, and interaction pacing visible on [the official Marathon website](https://marathonthegame.com/) and in the supplied 44-second reference recording. It does not copy or redistribute Marathon logos, imagery, text, source code, trademarks, or proprietary fonts.

## 2. Current-System Audit

The extension is currently a buildless Manifest V3 new-tab override:

- `newtab.html` contains the complete page and dialog structure.
- `app.js` contains state, Chrome Storage, migration, i18n, rendering, CRUD, search, presets, image processing, and drag behavior.
- `styles.css` contains global styling, appearance controls, responsive rules, and the current dark/light modes.
- `chrome.storage.local` is authoritative; lightweight UI preferences are mirrored to `localStorage`.
- The existing state has no explicit schema version.
- The current appearance property `theme` means `light / dark / system`, which conflicts with the new design-theme concept.
- Existing tests cover appearance preset import and the current i18n/appearance settings.

The following behavior is protected and must remain functional:

- Category create, edit, delete, icon upload, frequency ordering, and long-press drag ordering.
- Shortcut create, edit, delete, automatic favicon, custom icon, click-to-open, and long-press drag ordering.
- Search history, related suggestions, URL detection, search-engine switching, and custom search engines.
- Chinese/English switching.
- Chrome-original mode.
- Multiple custom wallpapers, automatic accent extraction, opacity, blur, panel opacity, and panel blur.
- Appearance preset create, update, rename, delete, import, apply, and persistence.
- Existing Chrome Storage and localStorage recovery behavior.

## 3. Chosen Technical Approach

Use a modular, buildless Vanilla JavaScript architecture. No React, large UI framework, 3D engine, or continuous Canvas animation is introduced.

```text
outputs/chrome-new-tab-dashboard-extension/
├── newtab.html
├── manifest.json
├── app.js                         # compatibility bootstrap
├── src/
│   ├── app.js                     # application bootstrap
│   ├── core/
│   │   ├── constants.js
│   │   ├── state.js
│   │   ├── storage.js
│   │   ├── migration.js
│   │   ├── i18n.js
│   │   └── import-export.js
│   ├── locales/
│   │   ├── zh-CN.js
│   │   └── en-US.js
│   └── ui/
│       ├── shell.js
│       ├── toolbar.js
│       ├── categories.js
│       ├── shortcuts.js
│       ├── search.js
│       ├── dialogs.js
│       ├── feedback.js
│       └── customize.js
├── styles/
│   ├── tokens.css
│   ├── base.css
│   ├── typography.css
│   ├── animations.css
│   ├── components.css
│   ├── responsive.css
│   └── themes/
│       ├── lost-starship.css
│       ├── liquid-glass.css
│       └── custom.css
├── fonts/
│   ├── barlow-condensed/
│   ├── inter/
│   ├── noto-sans-sc/
│   ├── ibm-plex-mono/
│   └── licenses/
└── icons/
```

`newtab.html` loads an ES module from local extension resources. The existing `app.js` remains a small compatibility bootstrap during migration so an interrupted update cannot leave the new-tab page blank. Modules expose narrow interfaces and do not directly mutate unrelated state.

## 4. State Schema v2 and Migration

The root state receives `schemaVersion: 2`.

```js
appearance: {
  designTheme: "lost-starship", // lost-starship | liquid-glass | custom
  colorMode: "dark",            // dark | light | system
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
}
```

Migration rules:

1. Missing `schemaVersion` is treated as v1.
2. Legacy `appearance.theme` migrates to `appearance.colorMode`.
3. `appearance.designTheme` defaults to `lost-starship`.
4. Existing accent, wallpaper, opacity, blur, radii, font scale, and density are retained in the migrated custom-theme values and old appearance presets.
5. Categories, shortcuts, search engines, history, order, icons, use counts, active IDs, and background image Data URLs are cloned without semantic changes.
6. Migration is a pure function and is tested against a complete v1 fixture.
7. The original state remains in memory until the migrated state has been successfully written.
8. A failed migration or failed Storage write leaves the original stored state untouched and loads a safe read-only rendering from it.
9. Lightweight preferences mirror `designTheme`, `colorMode`, locale, and active appearance preset, but never duplicate large image Data URLs.

Language and design theme are persisted independently.

## 5. Design Tokens

Components consume semantic tokens only. Theme files set values; component files do not contain theme-specific color literals.

Core token groups:

```css
--background-page;
--background-panel;
--background-card;
--background-hover;
--text-primary;
--text-secondary;
--text-muted;
--border-default;
--border-strong;
--border-active;
--action-primary;
--action-primary-hover;
--action-danger;
--focus-ring;

--space-1 through --space-10;
--radius-icon;
--radius-card;
--radius-panel;
--radius-control;
--shadow-panel;
--shadow-card;
--surface-blur;

--duration-instant: 80ms;
--duration-fast: 140ms;
--duration-normal: 220ms;
--duration-slow: 360ms;
--duration-scene: 600ms;
--ease-ui: cubic-bezier(0.2, 0.8, 0.2, 1);
--ease-sharp: cubic-bezier(0.4, 0, 0.2, 1);
```

The document uses `data-theme="lost-starship|liquid-glass|custom"` for the first-class visual theme and `data-color-mode="dark|light"` for resolved light/dark preference.

## 6. Typography

Only legally redistributable open-source fonts are packaged locally:

- Display Latin: **Barlow Condensed**.
- UI Latin: **Inter**.
- Chinese display and UI: **Noto Sans SC**, subset to the built-in UI dictionaries and common punctuation; user content falls back to the system CJK stack when a glyph is absent.
- Status codes, domains, counters, and coordinates: **IBM Plex Mono**.

SIL Open Font License files are stored under `fonts/licenses`. No remote font request is made. Only used weights and glyphs are included.

Font roles:

```css
--font-display-en;
--font-ui-en;
--font-display-zh;
--font-ui-zh;
--font-mono;
```

The scale contains Display XL, Display L, Heading 1–3, Body, Body Small, Label, Caption, and Mono Data. Each role has fixed size, weight, line height, and letter spacing tokens. Responsive breakpoints select predefined sizes; fonts do not scale continuously with viewport width. Chinese headings never inherit English uppercase transforms.

## 7. Layout and Information Architecture

### Desktop

1. A fixed narrow global toolbar contains local Lucide icons, active-state markers, and hover/focus tooltips.
2. A collapsible category panel shows category abbreviation or image, name, count, and index. It scrolls independently.
3. The main area contains a compact brand/status header, console-style search command area, category metadata, and an adaptive shortcut grid.
4. The footer becomes a system status bar with extension name, version, active theme, storage state, and item counts.
5. Customize opens as the approved large right-side console. The main page remains visible and updates in real time.

### Narrow screens

- The toolbar becomes a compact top or bottom action rail depending on available height.
- Categories become a horizontally scrollable or single-column collapsible list without horizontal document overflow.
- Shortcut cards become one or two columns according to available inline size.
- Customize becomes a full-screen settings workspace with a sticky header and footer.

Breakpoints and container rules explicitly cover 1280×720, 1366×768, 1440×900, 1920×1080, and 2560×1440 at browser zoom levels from 80% through 125%.

## 8. Theme Definitions

### Lost Starship

The default theme uses near-black backgrounds, acid yellow-green action color, cool white text, gray/green secondary text, 1px structural lines, square geometry, asymmetric industrial grids, restrained scan lines, sparse system labels, coordinates, indices, and generous black space.

Default semantic values begin from:

```css
--background-page: #050505;
--background-panel: #0a0c09;
--background-card: #0d100c;
--background-hover: #14180f;
--action-primary: #d7ff00;
--action-primary-hover: #e5ff4a;
--text-primary: #f4f5ef;
--text-secondary: #969b8e;
--text-muted: #62675d;
--border-default: rgba(215, 255, 0, 0.28);
--border-strong: rgba(215, 255, 0, 0.72);
--action-danger: #ff4d45;
```

Cards and panels are square by default. Hover changes border, structural marker, background, and icon position by at most 2px. No floating SaaS-card shadow or exaggerated scaling is used.

### Liquid Glass

Liquid Glass uses the same information architecture but separate tokens and visual states: translucent layered surfaces, controlled blur on major panels, edge highlights, restrained shadows, 16–24px card radii, 20–28px panel radii, depth separation, and a moving gloss highlight on hover.

It does not reuse Lost Starship grid marks, scan lines, terminal labels, or industrial corners. Per-card blur is avoided where an ancestor glass surface provides the necessary depth.

### Custom

Custom exposes page, panel, text, accent, and border colors; card/panel radii; card gap; content width; column count; card size; shadow strength; blur; opacity; motion intensity; font scale; density; wallpaper; mask; wallpaper blur; and grid/noise/scanline toggles.

All custom controls update design tokens immediately. The last committed custom values are stored separately from the live draft.

## 9. Component and Interaction Design

- Local Lucide icons are used for recognized actions. No emoji are used as UI icons.
- Every icon-only button has an accessible name and tooltip.
- Cards retain site icon, title, domain, menu, drag target, and click-to-open behavior.
- Hover never delays navigation. Active press feedback completes in 80–140ms.
- Category selection moves a structural marker and switches title/grid with a short directional transition rather than a generic fade.
- Initial scene construction completes within 700ms and is not replayed on category switches.
- Dragging has a ghost, source placeholder, insertion marker, auto-scroll near container edges, and a clear cancellation state.
- Empty, loading, disabled, focus, selected, error, success, and offline/local-only states are designed explicitly.
- Native `alert`, `prompt`, and `confirm` calls are replaced by project-owned modal and toast components.
- Theme switching transitions tokens without replacing the page DOM, changing scroll position, or clearing search input.

## 10. Customize Right-Side Console

The control console has a fixed header, scrollable content, and fixed action footer. Sections are:

1. Theme
2. Appearance
3. Colors
4. Typography
5. Layout
6. Cards
7. Background
8. Motion
9. Data Import/Export
10. Advanced

Theme choices use real miniature previews. Selected state includes label, structural marker, and `aria-pressed`; it is not represented by color alone.

Every setting provides a localized title, short description, control, current value, and local reset when useful. Opening Customize captures an appearance snapshot. `Undo changes` restores that snapshot. Live controls update immediately, mirror lightweight values to localStorage, and debounce Chrome Storage writes. Writes flush on control `change`, panel close, preset save, and page visibility change.

The panel supports:

- Restore defaults without deleting websites or categories.
- Save/update unlimited appearance presets.
- Export/import appearance presets.
- Save a named custom theme.
- Export/import custom-theme JSON with type/version validation.
- Export/import complete Runner data through a separate, explicitly labeled workflow.

Full-data import never shares an action with appearance import. Before complete-data replacement, the current state is exported internally as a recovery snapshot. Validation and Storage writes are atomic.

## 11. Internationalization

Chinese and English dictionaries live in separate modules and expose identical key sets. All visible strings, placeholders, titles, aria-labels, tooltips, toasts, validation messages, dialog text, empty states, status labels, and data-import errors come from i18n keys.

User-entered names, URLs, product names, and brands are not translated. Built-in category names and default icon abbreviations have explicit translations. Locale changes update the current DOM without reload and do not affect the selected design theme.

Automated tests fail when dictionary keys diverge or known hard-coded functional strings appear in HTML/component code.

## 12. Accessibility

- Complete Tab navigation and strong `:focus-visible` treatment.
- Enter/Space activation for semantic controls.
- Escape closes the topmost dialog or Customize console.
- Modal focus trapping and focus restoration to the invoking control.
- ARIA labels, selected/current/pressed state, status live regions, and descriptive validation.
- State is never communicated by color alone.
- Basic contrast is maintained in all themes and custom-color validation warns about unsafe combinations.
- `prefers-reduced-motion: reduce` disables scene staging, scanning, stagger, parallax, and decorative gloss movement while retaining essential feedback.

## 13. Performance

- No external font, theme, analytics, or image requests are added.
- Font subsets and only required weights are packaged.
- Storage is read once during boot.
- Theme changes mutate attributes and CSS variables instead of rebuilding the full page.
- DOM updates are scoped to changed regions.
- Animations favor transform and opacity.
- High-cost backdrop filters and shadows are restricted to major Liquid Glass surfaces.
- Decorative effects are CSS-only, bounded, and disabled for reduced motion.
- Shortcut navigation is never delayed by animation.
- Large custom wallpapers retain the existing compression and deferred optimization path.

## 14. Error Handling

- Storage, import, migration, image processing, and clipboard/download failures produce localized toasts or modals.
- Invalid JSON, product type, schema version, field type, color, URL template, or file size never mutates state.
- Missing custom wallpaper data does not invalidate the rest of an appearance preset.
- Failed debounced writes retain a dirty indicator and offer retry.
- A failed module load leaves the compatibility bootstrap capable of showing a recoverable error state rather than a blank new tab.

## 15. Verification Plan

Automated checks cover:

- v1-to-v2 migration with complete categories, shortcuts, icon images, custom engines, history, presets, and wallpaper data.
- Theme and custom-token normalization.
- Chrome Storage/localStorage precedence and failed-write atomicity.
- Category and shortcut CRUD and ordering.
- Search, URL detection, suggestions, and custom engines.
- Preset and complete-data import/export validation.
- Chinese/English key parity and hard-coded copy scans.
- Keyboard actions, modal stack, focus restoration, and reduced motion.

Browser verification covers:

- 1280×720, 1366×768, 1440×900, 1920×1080, and 2560×1440.
- Zoom at 80%, 90%, 100%, 110%, and 125%.
- Lost Starship, Liquid Glass, and Custom.
- Chinese and English.
- Empty, populated, menu, dialog, Customize, drag, toast, loading, and error states.
- Console errors, horizontal overflow, clipped text, stable grid geometry, and first-interaction responsiveness.

Artifacts are stored under `docs/screenshots/v2/`:

- Current v0.5.0 baseline.
- Lost Starship desktop and narrow layouts.
- Liquid Glass desktop and narrow layouts.
- Custom desktop and narrow layouts.
- Chinese and English equivalents.

The final store ZIP is validated with `unzip -t`, and its root manifest must report `2.0.0`.

## 16. Git and Delivery

Implementation stays on `redesign/lost-starship-ui-v2`. Normal commits are pushed after each major stage:

1. Design tokens and licensed fonts.
2. Main layout and component refactor.
3. Lost Starship, Liquid Glass, and Custom themes.
4. Customize console and import/export workflows.
5. i18n, accessibility, migration, tests, screenshots, README, and CHANGELOG.

Remote history is never force-pushed. No duplicate repository is created. The final report lists every changed/new file, theme architecture, font licensing, migration behavior, preserved features, test results, remaining limitations, branch, commits, and push result.

## 17. Acceptance Mapping

The redesign is complete only when:

- Lost Starship is the default for fresh and migrated installations.
- Lost Starship reads as a deliberate asymmetric industrial interface, not a generic black/green terminal.
- Liquid Glass has an independent token and state system.
- Custom settings preview and persist in real time and support undo/save/import/export.
- All old user data and operations survive migration.
- Chinese and English remain complete and spatially stable.
- The right-side Customize console and responsive full-screen variant are complete.
- Motion is efficient and reduced-motion compliant.
- Automated and browser checks pass without material console errors.
- Required screenshots, documentation, versioning, package, commits, and push are present.
- No Marathon protected asset or proprietary font is committed.
