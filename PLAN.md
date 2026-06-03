# Course / Tech Tree Page

A visual Python learning experience built into the playground. Users progress through Python concepts on a tech-tree map, with each node linking to a lesson page where they can read and run code.

---

## Goal

Replace the "Course coming soon…" stub in `CoursePage.jsx` with a fully interactive tech tree. Progress is stored in `localStorage` so no backend is needed.

---

## Pages & Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/#/course` | `CoursePage` | Tech tree canvas |
| `/#/learn/:slug` | `LessonPage` | Individual lesson |

---

## Tech Tree

### Node shape

```js
{
  id: 'loops',
  title: 'Loops',
  description: 'for and while loops',
  requires: ['variables'],   // prerequisite node IDs
  position: { x: 400, y: 300 },
}
```

### Suggested tree (linear with some branching)

```
variables → functions → loops → list-comprehensions
                              ↘
                               classes → inheritance
                  ↘
                   recursion
```

Exact shape is TBD — start linear, branch later.

### Node states

- **locked** — prerequisites not completed (greyed out)
- **unlocked** — prerequisites done, not yet started
- **completed** — user has marked it done (filled, distinct colour)

---

## Canvas Interaction

- Pan: click-drag on empty canvas space
- Zoom: scroll wheel / pinch
- Click a node: navigate to `/#/learn/<slug>` if unlocked

Implement with a plain `<canvas>` element or a positioned `<div>` container — no external graph library needed for this scale.

---

## Lesson Page (`LessonPage.jsx`)

Each lesson lives at `/#/learn/<slug>` and contains:

1. **Title + short prose explanation** — loaded from `public/lessons/<slug>.md` (fetch at runtime, same pattern as examples)
2. **Embedded Monaco editor** — pre-filled with a starter snippet from `public/lessons/<slug>.py`
3. **Run button** — reuses the existing Pyodide worker via `runner.js`
4. **Output panel** — reuses `OutputPanel.jsx`
5. **"Mark complete" button** — writes to localStorage and navigates back to `/#/course`

---

## Progress Storage

```js
// localStorage key: 'course-progress'
// value: JSON array of completed node IDs
// e.g. ["variables", "functions"]

function isComplete(id)   // reads localStorage
function markComplete(id) // appends id, writes back
function getProgress()    // returns the full array
```

A small `src/progress.js` module — no state library needed.

---

## Completion Mechanic

**Option A (start here):** "Mark complete" button — user self-reports. Simple, no hidden test infrastructure needed.

**Option B (later):** Code produces expected output — compare `stdout` against a golden string stored in `public/lessons/<slug>.expected`.

Start with Option A; Option B can be layered in per-lesson later.

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `src/pages/CoursePage.jsx` | Replace stub with tech tree canvas |
| `src/pages/LessonPage.jsx` | New — lesson layout |
| `src/components/TechTree.jsx` | New — canvas/div tree renderer |
| `src/components/TechNode.jsx` | New — single node (locked / unlocked / complete) |
| `src/progress.js` | New — localStorage helpers |
| `src/treeData.js` | New — node definitions and positions |
| `src/App.jsx` | Add `/#/learn/:slug` route |
| `public/lessons/<slug>.md` | New — lesson prose (one per node) |
| `public/lessons/<slug>.py` | New — starter snippet (one per node) |
| `src/ui/styles.css` | Add tech-tree and lesson page styles |

---

## Build Order

1. `src/progress.js` — pure logic, no UI, easy to test manually in the console
2. `src/treeData.js` — define 4–5 nodes to start
3. `TechNode.jsx` + `TechTree.jsx` — static render, no interaction yet
4. Wire into `CoursePage.jsx` — confirm nodes appear at the right positions
5. Add pan + zoom to the canvas
6. Add click-to-navigate (locked nodes do nothing)
7. `LessonPage.jsx` — prose + editor + run + mark-complete
8. Add the `/#/learn/:slug` route to `App.jsx`
9. Wire `markComplete` — confirm completed nodes update on the tree
10. Add first batch of lesson content (`public/lessons/`)
