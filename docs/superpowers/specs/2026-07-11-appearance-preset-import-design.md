# Runner Shortcut Hub Appearance Preset Import

## Scope

Add a safe JSON import workflow to the `APPEARANCE PRESETS` section of the existing Customize dialog. The feature imports all appearance presets in a selected file without changing shortcuts, clusters, website nodes, search settings, or other non-appearance data.

## User Interface

- Add `IMPORT PRESET` immediately before `SAVE PRESET` and `UPDATE CURRENT`.
- Reuse the existing preset action button styles, dimensions, spacing, hover states, typography, and responsive wrapping.
- Add a hidden file input with `accept=".json,application/json"`.
- Add a project-styled result dialog rather than using `alert()`.
- A successful import dialog shows `Import successful`, optional wallpaper warnings, and two actions:
  - `APPLY NOW`: apply the imported preset that was active in the source file, then mark it active.
  - `KEEP CURRENT`: retain the current appearance while keeping every imported preset.
- Errors use the existing project visual language and leave the Customize dialog usable.

## Supported Formats

The canonical version 1 envelope is:

```json
{
  "type": "runner-shortcut-hub-appearance-preset",
  "version": 1,
  "activePresetId": "preset-id",
  "presets": [],
  "backgrounds": []
}
```

The migration layer also accepts the previously exported recovery backup:

```json
{
  "format": "runner-shortcut-hub-appearance-backup",
  "formatVersion": 1,
  "activeAppearancePresetId": "preset-id",
  "appearance": {},
  "appearancePresets": [],
  "backgroundFiles": []
}
```

It may also accept a canonical single `preset` object for compatibility with the requested example. Unsupported types or versions are rejected.

## Import Pipeline

1. `openPresetImportDialog()` resets and opens the native JSON file picker.
2. `readPresetFile(file)` rejects empty files and files over 5 MB, then reads text without executing content.
3. JSON parsing rejects malformed or empty content.
4. `migrateImportedPreset(data)` converts supported legacy envelopes into one internal version 1 representation.
5. `validateImportedPreset(data)` checks the envelope, version, preset collection, names, and required appearance object.
6. `sanitizeImportedPreset(data)` allowlists only supported appearance fields and clamps values through existing normalization helpers.
7. `importPreset(data)` constructs a candidate state in memory, creates new preset and background IDs, resolves name collisions, and attempts one storage write.
8. Only after storage succeeds does the page replace its in-memory state and render the imported list.
9. The success dialog offers `APPLY NOW` and `KEEP CURRENT`.

## Allowed Appearance Fields

- `theme`: `light`, `dark`, or `system`
- `accentColor`
- `background`
- `activeCustomBackgroundId`
- `backgroundOpacity`
- `backgroundBlur`
- `panelOpacity`
- `panelBlur`
- Related custom background records containing a valid supported image Data URL

Unknown fields are ignored. Imported scripts, HTML, event handlers, external URLs, and arbitrary storage keys are never evaluated or fetched.

## Preset and Background Merging

- Every imported preset receives a new local ID and is appended to the existing list.
- Existing presets are never overwritten.
- Duplicate names become `Name (Imported)`, `Name (Imported 2)`, and so on.
- All presets in the file are imported in source order.
- The source active preset is remembered as the target for `APPLY NOW`; if absent, the first imported preset is used.
- Valid `data:image/jpeg`, `data:image/png`, `data:image/webp`, or `data:image/gif` Data URLs are restored without network access.
- Blob URLs, local file paths, unresolved internal storage keys, and unsupported image data are treated as unavailable.
- A preset with a missing custom wallpaper still imports. Its background falls back to the current background when valid, otherwise `plain`, and the success dialog includes: `The preset was imported, but its custom wallpaper could not be restored.`

## Atomicity and Error Handling

- No mutation occurs before parsing, migration, validation, sanitization, ID remapping, and candidate-state construction complete.
- Storage is written once. On a Chrome Storage failure, the original state remains active and the UI reports `Import failed`.
- Explicit error states cover malformed JSON, empty files, wrong product format, missing required fields, unsupported versions, file read failures, excessive size, and storage failures.
- The file input is reset after each attempt so the same file can be selected again.

## Localization

Add Chinese and English strings for the import button, success dialog, apply/keep actions, wallpaper warning, and error categories. User-visible messaging follows the selected Runner locale.

## Verification

- Import the exported `界面预设-可恢复.json` and confirm every contained preset appears.
- Confirm an existing `Preset 1` remains and the imported copy is named `Preset 1 (Imported)`.
- Confirm `APPLY NOW` updates theme, accent, wallpaper, opacity, and blur, and marks the target active.
- Confirm `KEEP CURRENT` preserves the current appearance.
- Reload a new tab and confirm imported presets persist.
- Import malformed, empty, oversized, wrong-type, unsupported-version, and missing-field files without damaging stored data or breaking Customize.
- Import a preset with only an invalid wallpaper path and confirm other appearance settings survive with a warning.
- Compare shortcuts, categories/clusters, and website nodes before and after import and confirm no changes.

