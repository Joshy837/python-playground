# Python Playground

A web app where users can write and run Python code directly in the browser.

---

## Goal

Build an in-browser Python editor that executes code and shows output — no backend server required.

---

## Approach: Pyodide (Recommended)

Pyodide runs a full Python interpreter in the browser via WebAssembly. This means:
- No server needed to execute code
- Supports most of the Python standard library
- Supports popular packages like numpy, pandas, matplotlib

---

## Features to Build

### MVP
- [ ] Code editor with syntax highlighting (use CodeMirror or Monaco Editor)
- [ ] Run button that executes the Python code
- [ ] Output panel showing stdout and errors
- [ ] Load Pyodide in the background on page load

### Nice to Have
- [ ] Clear button to reset editor and output
- [ ] Pre-loaded example snippets (hello world, fibonacci, etc.)
- [ ] Dark/light mode toggle
- [ ] Support for matplotlib plots rendered inline as images
- [ ] Keyboard shortcut to run (Ctrl+Enter / Cmd+Enter)
- [ ] Show a loading indicator while Pyodide is initialising

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Vite + vanilla JS (or React if preferred) |
| Python runtime | [Pyodide](https://pyodide.org) |
| Code editor | Monaco Editor (VS Code's editor) or CodeMirror |
| Styling | Tailwind CSS |

---

## Folder Structure (planned)

```
python-playground/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js          # entry point, loads Pyodide
│   ├── editor.js        # sets up the code editor
│   ├── runner.js        # handles running code via Pyodide
│   └── ui/
│       ├── styles.css
│       └── output.js    # renders stdout / errors / plots
└── public/
    └── examples/        # pre-written Python snippets
```

---

## Steps to Build

1. Scaffold the project with `npm create vite@latest`
2. Install and configure Monaco Editor or CodeMirror
3. Load Pyodide via CDN or npm package
4. Wire up the Run button to pass editor content to Pyodide
5. Capture stdout and stderr and display in the output panel
6. Style the layout (editor on left/top, output on right/bottom)
7. Add example snippets and keyboard shortcuts
8. Test edge cases: infinite loops, import errors, heavy computation
