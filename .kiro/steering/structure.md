# Project Structure

```
daymark-life-dashboard/
├── index.html          # Single HTML entry point; all markup lives here
├── css/
│   └── style.css       # All styles: variables, layout, components, dark mode, responsive
├── js/
│   └── script.js       # All JavaScript: state, DOM manipulation, localStorage, timers
└── README.md           # Project overview and deploy instructions (in Indonesian)
```

## Architecture

The entire app is **one HTML file + one CSS file + one JS file**. There are no modules, components, or separate pages.

### script.js structure
The JS is wrapped in an IIFE (`(() => { "use strict"; ... })()`) to avoid polluting the global scope. Internal organization (in order):
1. Utility helpers (`$` selector alias, `safeRead`/`safeWrite` for localStorage)
2. `STORAGE_KEYS` constant — all localStorage keys in one place
3. State variables (`tasks`, `links`, timer state)
4. Clock & greeting logic
5. Focus timer logic
6. Tasks logic (render, add, inline-edit, toggle, delete, clear); `editingId` tracks the task currently being edited
7. Quick links logic (render, add, delete, URL normalization)
8. Theme toggle logic

### style.css structure
1. Google Fonts import
2. `:root` CSS custom properties (design tokens)
3. Global resets and base element styles
4. Layout: `.app-shell`, `.topbar`, `.dashboard-grid`
5. Component styles (welcome panel, clock, focus timer, tasks, quick links, quote panel, footer)
6. `.sr-only` accessibility utility
7. `body.dark-mode` overrides
8. `@media (max-width: 760px)` — tablet/mobile breakpoint
9. `@media (max-width: 390px)` — small phone breakpoint
10. Task inline edit styles (`.task-edit-input`, `.edit-task`, `.edit-save-btn`, `.edit-cancel-btn`)

## Conventions
- **CSS custom properties** are defined on `:root` and used throughout. Always use these tokens; never hardcode colors or shadows.
- **IDs** are used for unique interactive elements (e.g. `#task-form`, `#clock`). Classes are used for reusable styles.
- **`$()` shorthand** (`document.querySelector`) is used for all DOM queries in JS.
- **`id` generation** for tasks and links uses `` `${Date.now()}-${Math.random().toString(16).slice(2)}` ``.
- **Accessibility**: interactive elements have `aria-label`, form inputs have associated `<label>` (using `.sr-only` where visually hidden), and live regions use `aria-live="polite"`.
- **Dark mode** is applied via the `body.dark-mode` class, which overrides CSS custom properties and specific component rules.
- New sections should follow the existing pattern: add markup in `index.html`, add styles in `style.css` (following the component section order), add logic in `script.js` (as a new named block at the bottom of the IIFE).
