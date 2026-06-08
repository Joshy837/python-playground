# Just Python It

A browser-based Python playground powered by WebAssembly. Write and run Python code entirely client-side — no server, no installs.

## Features

- **Playground** — Monaco editor with Python syntax highlighting, instant output, and example snippets
- **Docs** — searchable Python reference documentation
- **Course** — visual tech tree of Python concepts with progression tracking
- **Lessons** — guided lessons linked from the course tree

## Getting Started

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## How It Works

Python runs in a [Pyodide](https://pyodide.org) Web Worker — no backend required. The worker loads Pyodide from the jsDelivr CDN, executes code, and streams `stdout`/`stderr` back to the main thread. An automatic 10-second timeout kills runaway loops and restarts the worker transparently.

## Tech Stack

- [Vite](https://vitejs.dev) + [React](https://react.dev)
- [Pyodide](https://pyodide.org) (Python via WebAssembly)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Tailwind CSS v4](https://tailwindcss.com)
- [React Flow](https://reactflow.dev) (course tech tree)
