# Light Mode Contrast and Rounded Corner Decoration Design

## Goal

Make every functional label readable in light appearance mode while preserving the selected theme color for identity and interaction. Remove the square corner-decoration strokes from rounded shortcut cards so the decoration does not conflict with the configured card radius.

## Scope

- Main search, system statistics, category list, shortcut cards, actions, search history, focus search, and dialogs.
- All design themes that support the existing light appearance mode.
- Shortcut-card corner decorations only. Other panel corner decorations remain unchanged.
- No changes to shortcuts, categories, ordering, appearance persistence, or other user data.

## Color Model

The appearance application step derives two semantic colors from the selected accent:

- `--on-accent`: black or white, selected for readable text/icons on an accent-colored fill.
- `--accent-text`: an accessible accent-derived foreground for text shown directly on a light surface.

Light mode keeps the selected accent for borders, fills, and decorative markers. Normal content uses the existing primary, secondary, and muted text tokens. Text that previously used the raw accent on a light surface uses `--accent-text`; controls filled with the accent use `--on-accent`.

The light-mode CSS also replaces hard-coded dark-theme foreground/background combinations in the search placeholder, search history controls, disabled history state, destructive hover state, icon controls, and modal inputs.

## Rounded Card Decoration

The existing shortcut corner strokes are pseudo-elements with square geometry. The appearance application step exposes whether the configured card radius is rounded through a body class. When `cardRadius > 0`, the shortcut-card `::before` and `::after` decorations are hidden. At `0px`, the original corner strokes remain.

This preserves the industrial decoration for square cards and removes the visual collision shown in the reported rounded-card screenshot.

## Validation

- Unit checks cover the generated contrast variables and rounded-card state.
- Theme CSS tests assert the light-mode semantic overrides and radius-dependent decoration rule.
- Browser verification checks the light interface at desktop size, including search placeholder, top controls, sidebar, selected/hovered cards, dialogs, and rounded card corners.
- Existing test suites must remain green, and the tested files are synchronized to Chrome's actual unpacked-extension directory before live verification.
