# Unified Accent Effects

## Goal

Use the selected theme color as the single source for colored interaction feedback. Neutral structure colors, website artwork, and semantic danger colors remain independent.

## Behavior

- Derive soft, hover, active, border, strong-border, focus, and primary-hover tokens from the selected accent.
- Apply those tokens to category states, cards, buttons, focus rings, drag targets, search controls, switches, and customization controls.
- Recompute the tokens immediately whenever appearance settings or presets change.
- Keep Minimal theme monochrome by deriving its effects from neutral gray instead of the stored accent.
- Preserve readable foreground colors by using the existing contrast helpers.

## Verification

- Assert that all semantic effect variables update from a custom accent.
- Assert that Minimal theme produces grayscale effect variables.
- Run existing appearance, interaction, migration, import, and data tests.
