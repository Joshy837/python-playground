# Known Bugs

Logged from code health check on 2026-06-08.

---

## Bug 1 — Ctrl+Enter during restart bypasses guard (HIGH)

**File:** `src/pages/PlaygroundPage.jsx` line 108
**Status:** Fixed (2026-06-08)

`handleRun` only checks `if (isRunning)` at the top, but during a worker restart `isRunning` is `false` while `isRestarting` is `true`. The run button is correctly disabled (`runBtnDisabled = !pyodideReady || isRestarting`), but the Monaco Ctrl+Enter keybinding calls `handleRunRef.current()` which skips the `isRestarting` check entirely.

**Failure:** Timeout fires or Stop is pressed → `isRunning=false`, `isRestarting=true` → user presses Ctrl+Enter → `runCode` posts a `run` message to the still-loading worker → `pyodide-worker.js:23` silently drops it (`pyodide == null`) → `pendingResult` is never called → `isRunning` stays stuck `true` for 10 s until the next timeout fires, with no output or feedback to the user.

**Fix:** Add `|| isRestarting` to the guard in `handleRun`:
```js
if (isRunning || isRestarting) { ... }
```

---

## Bug 2 — PyProxy memory leak on every run (MEDIUM)

**File:** `public/pyodide-worker.js` lines 35–36
**Status:** Open

`pyodide.runPython(PLOT_CAPTURE)` returns a `PyProxy` wrapping a Python list. `.toJs()` converts the contents to a JS array but does not destroy the proxy. The proxy is never explicitly `.destroy()`ed, so the Python-side object's reference count is never decremented and the WASM heap leaks one object per run.

**Failure:** After many code runs in a long session, accumulated undestroyed PyProxies exhaust the WASM heap, causing subsequent runs to throw OOM errors.

**Fix:** Add `plotsProxy.destroy()` after `.toJs()`:
```js
const plotsProxy = pyodide.runPython(PLOT_CAPTURE)
const plots = plotsProxy.toJs ? plotsProxy.toJs() : Array.from(plotsProxy)
plotsProxy.destroy()
```

---

## Bug 3 — Snippet modal stuck in loading state on fetch error (MEDIUM)

**File:** `src/pages/PlaygroundPage.jsx` lines 163–166
**Status:** Open

`handleSnippetSelect` has no `try/catch`. If `fetch` rejects (network offline), `setModalSnippet('loading')` was already called and is never reset. The loading modal's backdrop calls `handleClose` which only sets `closing=true` — it never calls `onClose` (that only fires via `onAnimationEnd` on the non-loading path). The modal is unrecoverable.

Secondary issue: `loadExample` also has no `res.ok` check — a 404 resolves successfully and the HTML error body is silently loaded into the editor as code.

**Fix:** Wrap both fetch calls in `try/catch` and check `res.ok`:
```js
async function handleSnippetSelect({ label, file }) {
  setModalSnippet('loading')
  try {
    const res = await fetch(`/examples/${file}`)
    if (!res.ok) throw new Error(res.statusText)
    const code = await res.text()
    setModalSnippet({ label, code })
  } catch {
    setModalSnippet(null)
  }
}
```

---

## Minor — PLOT_CAPTURE runs on every execution (EFFICIENCY)

**File:** `public/pyodide-worker.js` line 35
**Status:** Open

`PLOT_CAPTURE` runs on every code execution including simple `print()` calls. It imports `matplotlib.pyplot`, calls `plt.get_fignums()`, and creates a PyProxy even when no plots exist — unnecessary overhead for non-matplotlib code.

**Fix:** Gate on whether the user code contains `'matplotlib'` before running the capture, or check `plt.get_fignums()` cheaply first.

---

## Minor — `completed` array defeats useMemo in CoursePage (PERFORMANCE)

**File:** `src/hooks/useProgress.js` line 70
**Status:** Open

`completed` is computed inline without `useMemo`, producing a new array reference on every render. Both `nodes` and `edges` memos in `CoursePage` list `completed` as a dep, so they recompute on every quiz answer (any `quizProgress` state change), even when no node completion status changed.

**Fix:** Wrap with `useMemo`:
```js
const completed = useMemo(
  () => NODES.filter(n => isComplete(n.id)).map(n => n.id),
  [stepsDone]
)
```

---

## Minor — `loadStep` returns a mutable reference into the shared cache (FRAGILE)

**File:** `src/data/loadStep.js` line 14
**Status:** Open

`loadStep` returns `data.steps[stepIdx]` — a direct reference into the cached object stored in the module-level `Map`. Any caller that accidentally mutates the returned step object (e.g. adds a property) will silently corrupt that step for every future load in the same session, since the cache is never invalidated.

**Failure:** A future caller does `step.resolved = true` → `cache.get(nodeId).steps[stepIdx]` is now mutated → next `loadStep` call for the same step returns the polluted object → tests, quiz, or starter code behaves unexpectedly for the rest of the session.

**Fix:** Return a shallow copy so callers get an isolated object:
```js
return { ...step }
```

---

## Minor — `onNodeClick` mobile/desktop branches are identical (SIMPLIFICATION)

**File:** `src/pages/CoursePage.jsx` lines 195–203
**Status:** Open

Both branches of the `isMobile` conditional call the exact same `setExpandedId` updater. The extra `setSheetExiting(false)` in the mobile branch is a no-op — `sheetExiting` is only ever set to `true` inside `closeSheet`, which is triggered by pane-click or backdrop-tap, never by a node click.

**Fix:** Collapse to a single call:
```js
const onNodeClick = useCallback((_, node) => {
  if (!node.data.unlocked && !node.data.done) return
  setExpandedId(prev => prev === node.id ? null : node.id)
}, [])
```

---

## Minor — Duplicate regex passes for fenced code blocks in renderMarkdown (SIMPLIFICATION)

**File:** `src/pages/LessonPage.jsx` lines 720–723
**Status:** Open

Two consecutive `.replace()` calls handle fenced code blocks but produce identical output — the only difference is an optional `python\n` prefix on the opening fence. This traverses the full markdown string twice unnecessarily.

```js
// Before (two passes):
.replace(/```python\n([\s\S]*?)```/g, ...)
.replace(/```\n?([\s\S]*?)```/g, ...)
```

**Fix:** Combine into one regex:
```js
.replace(/```(?:python\n|\n?)([\s\S]*?)```/g, (_, code) =>
  `<pre class="lesson-code-block"><code>${highlightWithMonaco(code.trimEnd(), monacoTheme)}</code></pre>`)
```
