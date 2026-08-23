# Customize Backdrop Close Design

## Goal

Allow users to close the Customize drawer by clicking the dimmed area to its left, without requiring the header close button.

## Interaction

- A complete click on the native dialog backdrop closes the Customize dialog.
- Clicking anywhere inside the Customize drawer does not close it, including empty panel space, controls, cards, sliders, and the scrollbar.
- The existing header close button and Escape-key behavior remain unchanged.
- The behavior applies only to the Customize dialog. Category, shortcut, search-engine, import, confirmation, and feedback dialogs keep their current behavior.

## Implementation

Keep the existing native `<dialog>` structure and register one click handler on `customizeDialog`. A backdrop click is accepted only when:

1. The event target is the dialog element itself.
2. The click coordinates are outside the dialog's bounding rectangle.

Using coordinate hit testing prevents a click on blank space inside the right-side drawer from being mistaken for a backdrop click. Handling `click` rather than `pointerdown` avoids closing the drawer at the start of a drag or text selection.

## Testing

- Unit coverage verifies that coordinates outside the drawer are treated as backdrop clicks.
- Unit coverage verifies that coordinates inside the drawer are not treated as backdrop clicks.
- Browser smoke coverage verifies that clicking the left backdrop closes the Customize dialog.
- Browser smoke coverage verifies that clicking inside the drawer leaves it open.
- Existing extension tests must continue to pass without changing stored data or other dialog behavior.
