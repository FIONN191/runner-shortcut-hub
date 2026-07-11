# Runner Shortcut Hub i18n, Customize, Radius, and Persistence Design

## Scope

Extend the existing Runner Shortcut Hub implementation without replacing its page structure, data ownership, search behavior, category interactions, shortcut editing, drag ordering, or preset import workflow. This change centralizes all functional copy, reorganizes the existing Customize dialog, adds independent radius controls and lightweight typography/layout controls, extends appearance presets, and adds resilient local preference persistence.

## Language System

- Use one `translations` dictionary with canonical locale IDs `zh-CN` and `en`.
- Treat legacy saved locale value `zh` as `zh-CN` during normalization.
- A first visit with no saved preference uses `zh-CN`, independent of browser or operating-system language.
- Keep brand, product, site, URL, and proper names untranslated. `Runner Shortcut Hub`, Google, Fotor, TikTok, ChatGPT, Claude, YouTube, iCloud, Pinterest, Gmail, and user-created names remain source content.
- Every functional string receives a translation key, including visible text, dynamic menu items, prompts, confirmations, form errors, empty states, placeholders, tooltips, `title`, and `aria-label` values.
- Replace direct locale branches such as `state.locale === "en" ? ... : ...` with dictionary keys.
- The main language control displays the explicit options `中文 / English`. The selected side is visually highlighted and exposes `aria-pressed` or an equivalent accessible selected state.
- Language changes render immediately without reload and persist before the next tab is opened.
- Functional HTML nodes use translation-key attributes or are populated by the centralized binding map; they do not contain independent Chinese or English copies. The document starts with `lang="zh-CN"`, and the bottom-loaded application script applies the initial dictionary before the first normal interaction. Automated checks maintain a small allowlist only for brand names, URL examples, and symbols.

### Chinese Copy Direction

- `RUNNER / OPS` becomes `RUNNER / 控制台`.
- `SHORTCUT HUB` becomes `快捷中心`.
- Search, execute, status, category, active-panel, edit, add, home, customization, preset, wallpaper, rename, delete, and current labels use the approved Chinese wording.
- English mode uses complete natural English equivalents rather than abbreviations such as `EN`, `EXEC`, or `CLUSTERS` where they are functional controls.

## Customize Dialog Structure

Keep the existing modal and dark technology styling. Reorder its content into:

1. Language
2. Appearance mode
3. Theme color
4. Size and corner radius
5. Appearance presets
6. Wallpaper
7. Reset to default

The modal header is sticky. The content area scrolls vertically, the dialog is centered on desktop, width never exceeds the viewport, and height is capped at `85vh`. Narrow layouts keep sliders and values usable without horizontal overflow. Selected options retain the existing accent border treatment.

## Appearance Data Model

Extend `appearance` with:

```json
{
  "iconRadius": 8,
  "iconRadiusUnit": "px",
  "cardRadius": 0,
  "panelRadius": 0,
  "buttonRadius": 0,
  "fontScale": 1,
  "cardDensity": "comfortable"
}
```

- `iconRadius` accepts `0` through `24` pixels plus the semantic circular mode represented by `iconRadiusUnit: "percent"` and `iconRadius: 50`.
- The icon slider exposes a continuous range and quick options: square `0px`, subtle `4px`, medium `8px`, large `14px`, and circle `50%`.
- Card, panel, and button radius controls are independent pixel values. Their defaults are `0px`, preserving the current design.
- Font scale uses a restrained supported range around the current `1` default.
- Card density supports stable named values such as `compact`, `comfortable`, and `spacious`; the current layout maps to `comfortable`.
- Old saved states and old appearance presets receive these defaults during normalization.

## CSS Variables and Scope

Apply settings through global variables:

```css
--icon-radius
--card-radius
--panel-radius
--button-radius
--font-scale
```

- `--icon-radius` applies only to website icons, category icons, search-result icons, shortcut editor previews, category editor previews, and preview icons inside Customize.
- It does not apply to shortcut cards, panels, or buttons.
- `--card-radius` applies to shortcut cards and the card sample only.
- `--panel-radius` applies to top-level panels, workspace sections, dialogs, and the panel sample.
- `--button-radius` applies to command buttons and the button sample, excluding elements that must remain explicitly circular for their meaning.
- Pseudo-element overlays follow the owning icon or container radius so borders do not remain square over rounded elements.

## Live Preview

Add a compact preview inside Size and Corner Radius with one icon, one shortcut card, one button, and one small panel. Each slider and quick option:

1. updates `state.appearance`;
2. updates CSS variables and preview values immediately;
3. persists the lightweight preference snapshot;
4. schedules the complete Chrome Storage write using the existing storage path.

Closing Customize does not roll back changes and no separate Save action is required.

## Appearance Presets

Extend each appearance snapshot to include:

- appearance mode and theme color;
- wallpaper, opacity, and blur settings;
- panel opacity and blur;
- icon, card, panel, and button radius settings;
- locale;
- font scale;
- card density.

Saving and updating a preset captures these values. Applying a preset restores all values immediately and updates both persistence layers. Old presets lacking new fields inherit current defaults. Preset import version 1 remains supported; the allowlist and sanitizer are extended with the new fields while continuing to ignore unknown values.

Locale remains stored in the top-level state for general application behavior. Preset snapshots include a locale field only so applying a preset can intentionally restore it.

## Dual Persistence

- Keep `chrome.storage.local` as the authoritative complete-state store, including sites, categories, ordering, presets, search data, and custom wallpaper image data.
- Add a lightweight localStorage key, `runnerShortcutHubUiPreferences`, containing only locale, the compact appearance configuration, active appearance preset ID, font scale, and card density. Do not duplicate custom wallpaper Data URLs into localStorage.
- On startup, normalize Chrome Storage first, then merge valid local UI preferences over only the allowed UI fields.
- If Chrome Storage is unavailable, continue using the existing full-state localStorage fallback.
- Every UI preference change writes the lightweight localStorage snapshot immediately. The existing Chrome Storage write follows without deleting or replacing unrelated data.
- A malformed or unavailable localStorage snapshot is ignored. A Chrome Storage failure does not erase local preferences; a localStorage quota or access failure does not corrupt Chrome Storage.

## Reset to Default

Place `Reset to Default` at the bottom of Customize. Use a project-styled confirmation dialog with localized copy:

- Chinese: `确定要恢复默认外观设置吗？此操作不会删除网站和分类数据。`
- English: `Reset all appearance settings to default? Your websites and categories will not be deleted.`

Confirmation resets only locale, appearance mode, theme color, radius values, wallpaper selection and tuning, font scale, card density, and active appearance-preset selection. It preserves websites, categories, shortcut and category ordering, user-created shortcuts, search engines, and history. Custom wallpaper image records may remain stored for later reuse, but the active wallpaper resets to the default Runner background.

Default values are Chinese, dark appearance, `8px` icon radius, `0px` card/panel/button radius, font scale `1`, and comfortable density.

## Migration and Safety

- Add a lightweight appearance normalizer that clamps all numeric values and validates named options.
- Migrate `zh` to `zh-CN` without changing any user content.
- Extend preset import/export sanitizers only with documented UI fields.
- Never translate or rewrite user-created category names, shortcut names, search-engine names, URLs, or icon image data.
- Reset and migration functions build candidate state first and write it atomically before replacing active state where failure could otherwise damage data.

## Verification

- Fresh state renders complete Chinese functional copy without an English flash.
- English mode renders complete English functional copy across the main page, classic page, Customize, category/search-engine/shortcut dialogs, preset import result, confirmation dialogs, titles, placeholders, and accessibility labels.
- Brand and site names remain unchanged.
- Language switches immediately and persists across reload through localStorage and Chrome Storage.
- Radius changes update the live preview and correct target elements only.
- Circle mode produces a full circle for square icons.
- All four radius values, locale, font scale, and density survive reload and save/apply/update through appearance presets.
- Old state, old presets, and version 1 imported presets normalize without failure.
- Reset restores only UI defaults and leaves category, website, order, and shortcut snapshots byte-equivalent.
- Existing preset import tests continue to pass.
- Static scans flag unapproved user-visible hardcoded strings and direct locale ternaries.
- JavaScript syntax, manifest JSON, package integrity, and storage failure paths pass automated checks.
- Search, category selection/editing/dragging, shortcut editing/dragging/opening, search-engine selection, classic mode, and new-tab load remain operational.
