# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (usually http://localhost:5173 or 5174)
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

No test runner or linter is configured.

## Architecture

This is a serverless, client-side-only app. Python runs entirely in the browser via WebAssembly — there is no backend.

**Data flow on Run:**
1. `main.js` reads code from the Monaco editor via `getValue(editor)`
2. `runner.js:runCode()` resets Python's `sys.stdout`/`sys.stderr` to fresh `io.StringIO()` instances on every run, executes user code with `pyodide.runPythonAsync()`, then reads back the captured strings
3. `output.js:renderOutput()` renders `{ stdout, stderr, error }` into `#output` using `.output-stdout` / `.output-stderr` / `.output-error` CSS classes (white / yellow / red in dark mode)

**Pyodide loading (`public/pyodide-worker.js` + `src/runner.js`):**
Pyodide runs in a dedicated Web Worker (classic worker, not a module worker) to keep the main thread unblocked. The worker file lives in `public/` so it's served as a static asset at `/pyodide-worker.js` — this lets it use `importScripts` to load the Pyodide classic-JS build from jsDelivr CDN. `PYODIDE_VERSION` is pinned at the top of `pyodide-worker.js`. The worker auto-initialises on spawn and posts `{ type: 'ready' }` when Pyodide is loaded; `runner.js` resolves `initPyodide()` on that message. The Run button stays disabled until `initPyodide()` resolves. `#pyodide-status` shows "Loading…" (yellow) → "Ready" (green) or "Load failed" (red).

**Infinite loop protection (`src/runner.js`):**
`runCode` sets a `TIMEOUT_MS` (10 s) timer. On expiry it calls `worker.terminate()` (hard-kills the running Python), spawns a fresh worker, and resolves with `{ error, restartPromise }`. `main.js` detects `restartPromise`, keeps the run button disabled and shows "Restarting…" while it awaits the new worker's ready signal. The worker/pending-callback state is managed via module-level `pendingReady` / `pendingResult` variables in `runner.js`.

**Monaco Editor (`src/editor.js`):**
Python syntax highlighting uses Monaco's built-in Monarch tokenizer — no separate language worker is needed. `vite-plugin-monaco-editor` is configured with only `editorWorkerService`. Note the `.default({...})` call on the plugin import — this is required for CJS/ESM interop.

**Theming:**
Two systems must stay in sync when the theme changes:
- `monaco.editor.setTheme(monacoTheme)` — updates the editor
- `document.documentElement.dataset.theme = PAGE_THEME[monacoTheme]` — updates the page CSS

`PAGE_THEME` in `main.js` maps Monaco theme IDs (`vs-dark`, `vs`, `hc-black`, `hc-light`) to CSS `data-theme` values (`dark`, `light`, `hc-dark`, `hc-light`). All page colors are CSS custom properties defined in `src/ui/styles.css` under `:root` (dark default) and `[data-theme="..."]` overrides.

**Styling:**
Tailwind v4 via `@tailwindcss/vite`. There is no `tailwind.config.js` — configuration lives entirely in `src/ui/styles.css` as `@import "tailwindcss"`. Component classes (`.app-header`, `.output-panel`, `.example-btn`, etc.) are hand-authored in that file and consume the CSS custom properties.

**Layout:**
Responsive split-pane: editor and output panel are stacked (`flex-col`) on mobile and side-by-side (`md:flex-row`) on desktop. The output panel is fixed at `md:w-2/5` on desktop.

**`output.js`:**
Exports both `renderOutput` and `clearOutput`. `clearOutput` is not currently wired to any UI element.

**Example snippets** live in `public/examples/` as plain `.py` files, served as static assets and fetched at runtime via `fetch('/examples/<file>')`.
