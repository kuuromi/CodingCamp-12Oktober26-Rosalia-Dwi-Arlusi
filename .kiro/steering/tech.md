# Tech Stack

## Stack
- **HTML5** — single `index.html` at the project root; `lang="id"` (Indonesian)
- **CSS3** — single `css/style.css`; no preprocessor, no utility framework
- **JavaScript (ES2020+)** — single `js/script.js`; vanilla, no framework, no bundler
- **Google Fonts** — DM Sans, DM Mono, Manrope (loaded via `@import` in CSS)

## No Build Step
There is no package manager, bundler, transpiler, or test runner. The project runs directly in a browser by opening `index.html`. Do not introduce `node_modules`, `package.json`, or build tooling unless explicitly requested.

## Running Locally
Open `index.html` directly in a browser, or use the VS Code **Live Server** extension for auto-reload during development.

## Deployment
Deployed as a static site (e.g. GitHub Pages). `index.html` must remain at the repository root. File paths are case-sensitive on the server — keep all asset paths lowercase and relative.

## Browser APIs Used
- `localStorage` — all persistence
- `setInterval` / `clearInterval` — clock and focus timer
- `Intl.DateTimeFormat` — locale-aware date formatting (`id-ID`)
- `URL` constructor — URL validation and normalization

## No External Dependencies
No npm packages, CDN scripts, or third-party JS libraries. Keep it that way unless explicitly asked to add a dependency.
