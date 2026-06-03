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
2. `runner.js:runCode()` redirects Python's `sys.stdout`/`sys.stderr` to `io.StringIO`, runs the code with `pyodide.runPythonAsync()`, then reads back the captured strings
3. `output.js:renderOutput()` renders `{ stdout, stderr, error }` into `#output` with colour-coded `<pre>` tags (white / yellow / red)

**Pyodide loading (`src/runner.js`):**
Pyodide is loaded from jsDelivr CDN via an injected `<script>` tag (not bundled via npm — it's ~10 MB of WASM). The version is pinned at the top of the file as `PYODIDE_VERSION`. After the script loads it exposes `window.loadPyodide`. The Run button stays disabled until `initPyodide()` resolves.

**Monaco Editor (`src/editor.js`):**
Python syntax highlighting uses Monaco's built-in Monarch tokenizer — no separate language worker is needed. `vite-plugin-monaco-editor` is configured with only `editorWorkerService`. Note the `.default({...})` call on the plugin import — this is required for CJS/ESM interop.

**Styling:**
Tailwind v4 via `@tailwindcss/vite`. There is no `tailwind.config.js` — configuration lives entirely in `src/ui/styles.css` as `@import "tailwindcss"`.

**Example snippets** live in `public/examples/` as plain `.py` files, served as static assets.
