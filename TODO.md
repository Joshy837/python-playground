# TODO

## Design System Overhaul

- [ ] Fix `--accent` undefined CSS variable — used in `.snippet-drawer`, `.save-snippet-*`, `.delete-snippet-*` but never declared in `:root` or any theme block
- [ ] Replace hardcoded hex values with token vars
  - `#16a34a` in `.lesson-run-btn` and `.doc-run-btn` → `var(--status-green)`
  - `#f87171` in `.snippet-card-delete` → `var(--output-error)`
  - `#4ade80` in `.toast` → `var(--status-green)`
- [ ] Add a typography scale to `:root` (font sizes, weights, line heights) so component styles stop using ad-hoc `rem` values
- [ ] Add a spacing scale to `:root` (padding/gap tokens) for the same reason
- [ ] Split `styles.css` (~2000 lines) into per-feature files:
  - `tokens.css` — CSS vars + `@theme inline` bridge
  - `base.css` — body, animations, structural helpers
  - `course.css` — course tree nodes, progress bar, bottom sheet
  - `lesson.css` — slideshow, nav bar, prose, editor box, section accents
  - `quiz.css` — quiz options, feedback, fill-in-the-blank
  - `docs.css` — doc page, sidebar, cards
  - `snippets.css` — snippet drawer, cards, save/delete modals
  - `modal.css` — shared modal backdrop + animations
  - `landing.css` — landing page aurora, code demo
  - `toast.css` — toast notification
