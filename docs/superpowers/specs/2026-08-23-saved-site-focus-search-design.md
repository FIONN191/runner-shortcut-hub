# Saved Site Focus Search Design

## Goal

Turn the left-rail Focus Search action into a dedicated command-palette-style finder for websites already saved in Runner Shortcut Hub. The finder must remain independent from the top search box, search history, and external search engines.

## Scope

- Search saved shortcuts by title, hostname, full URL, and displayed category name.
- Open a selected shortcut in the current tab.
- Support mouse, keyboard, Chinese, English, desktop, and narrow-window layouts.
- Reuse existing shortcut usage tracking and the global usage-sorting preference.
- Do not change shortcut, category, appearance, preset, wallpaper, or search-history schemas.

## Interaction

1. Clicking the left-rail Focus Search button opens a centered modal finder and marks the rail button active.
2. The finder autofocuses its input. The top search box and its current value remain untouched.
3. The initial finder state contains only localized guidance. It does not show saved websites until the user enters a non-empty query.
4. Typing filters saved shortcuts immediately. Each result shows the shortcut icon, title, readable hostname, and category name.
5. Clicking a result or selecting it with the keyboard and pressing Enter records the shortcut use and opens its URL in the current tab.
6. Arrow Up and Arrow Down move the active result. Escape, the close button, or a complete click on the backdrop closes the finder.
7. The input includes a clear command. Clearing it restores the initial guidance state.
8. Closing the finder clears its transient query and selection, removes the temporary search-button active state, and restores the normal Home rail state. Focus returns to the left-rail Focus Search button.

## Search And Ranking

The finder uses a dedicated pure matching function rather than the top search panel's mixed suggestion builder. It never adds its query to search history and never falls back to an external search engine.

Matching is case-insensitive and compares the normalized query against:

1. Shortcut title.
2. Readable hostname.
3. Full shortcut URL.
4. Displayed category name.

Results are ranked by the strongest match:

1. Exact title match.
2. Title prefix match.
3. Title substring match.
4. Hostname match.
5. Full URL or category-name match.

When two results have the same match rank, the existing `sortShortcutsByUsage` setting determines the tie-breaker. If enabled, higher `useCount` values come first. If disabled, existing category and shortcut manual order is preserved. Ranking does not mutate either order.

Shortcuts with missing or invalid URLs are excluded. The result viewport scrolls internally, so the complete saved-shortcut collection remains searchable without imposing a per-category storage limit.

## Components And State

- Add a dedicated finder dialog to `newtab.html`, following the existing dialog and button patterns.
- Add transient finder state for the query, active result index, and open status. None of this state is persisted.
- Add a saved-shortcut matcher that returns result records containing the shortcut id, title, URL, hostname, category label, icon data, rank, usage count, and manual-order metadata.
- Add rendering and event functions for opening, closing, clearing, filtering, selecting, and activating finder results.
- Reuse the existing shortcut icon renderer or its underlying icon data rules so finder icons remain consistent with shortcut cards and global icon-radius settings.
- Reuse `recordShortcutUse(shortcut.id)` before assigning the current page location to the selected shortcut URL.

The existing top search form, search-history panel, search-engine dialog, and `runSearch()` path remain unchanged.

## Visual Design

- Use a centered, compact command palette over the existing dimmed backdrop.
- Constrain width to the viewport and height to no more than the visible page; make only the result list scroll.
- Follow the active design theme, appearance mode, accent color, panel radius, button radius, icon radius, and density settings.
- Give the active keyboard result a clear accent outline or background without shifting layout.
- Keep the close and clear controls as familiar symbols with localized accessible names and tooltips.
- On narrow windows, reduce outer margins and stack result metadata when required; text must truncate or wrap without overlapping controls.

## Internationalization And Accessibility

All visible text, placeholders, empty states, titles, tooltips, and ARIA labels use the existing i18n dictionary. Required messages include:

- Saved-site finder title.
- Search-saved-sites placeholder.
- Initial guidance.
- No saved websites.
- No matching websites.
- Clear finder query.
- Close finder.
- Result metadata labels when needed by assistive technology.

The dialog traps focus while open through native dialog behavior. Opening places focus in the input, keyboard selection exposes the active option, and closing restores focus to the trigger. The result list uses appropriate combobox/listbox semantics or equivalent accessible relationships.

## Error Handling

- If there are no valid saved shortcuts, show the localized no-saved-websites state after the user types.
- If valid shortcuts exist but none match, show the localized no-match state.
- Ignore malformed shortcut records instead of allowing the finder to throw.
- Activating a result attempts to persist its usage count first. If that write fails, the selected website still opens and no other stored data is changed.
- Opening or closing the finder must not write Chrome Storage.

## Verification

- The rail button opens the independent finder and focuses its input.
- The initial state does not expose saved-site results.
- Title, hostname, full URL, and category queries return the expected shortcuts.
- Match ranking follows the documented priority.
- Usage sorting affects only equal-rank results and only when the existing preference is enabled.
- Mouse activation and keyboard Enter open the correct URL in the current tab and increment usage once.
- Arrow navigation, clear, Escape, close button, and backdrop close behave correctly.
- Closing and reopening resets the transient query and selection.
- Invalid URLs are excluded without errors.
- Chinese and English text update immediately when the locale changes.
- The top search box, history panel, search engines, shortcut editing, and category behavior remain unchanged.
- Desktop and narrow-window browser smoke checks show no clipping, overlap, or inaccessible controls.
- Existing automated tests and the extension console remain clean.
