import { Tag, GitBranch, List, Repeat, BookOpen, Code2, Lightbulb } from 'lucide-react'

// Snake/serpentine layout: 3 columns, rows alternate L→R then R→L.
// Positions are centers (nodeOrigin=[0.5, 0.5]).
const C1 = 150  // left column
const C2 = 340  // middle column
const C3 = 530  // right column
const R1 = 80   // row 1
const R2 = 220  // row 2
const R3 = 360  // row 3

export const NODES = [
  // Row 1: left → right
  {
    id: 'basics',
    title: 'Getting Started',
    icon: Lightbulb,
    x: C1, y: R1,
    requires: [],
    description: 'Learn to show output and leave notes in your code.',
    steps: [
      { title: 'print()' },
      { title: 'Comments' },
    ],
  },
  {
    id: 'variables',
    title: 'Variables & Types',
    icon: Tag,
    x: C2, y: R1,
    requires: ['basics'],
    description: 'Learn how to store data in variables.',
    steps: [
      { title: 'Your First Variable' },
      { title: 'Strings' },
      { title: 'Joining Strings' },
      { title: 'Integers' },
      { title: 'Maths' },
      { title: 'Floats' },
      { title: 'Booleans' },
    ],
  },
  {
    id: 'conditionals',
    title: 'Conditionals',
    icon: GitBranch,
    x: C3, y: R1,
    requires: ['variables'],
    description: 'Make decisions in your code with if, elif, and else.',
    steps: [
      { title: 'Comparing Things' },
      { title: 'if' },
      { title: 'if / else' },
      { title: 'elif' },
    ],
  },
  // Row 2: right → left (snake turn at C3)
  {
    id: 'lists',
    title: 'Lists',
    icon: List,
    x: C3, y: R2,
    requires: ['conditionals'],
    description: 'Store and work with collections of values.',
    steps: [
      { title: 'Creating a List' },
      { title: 'Getting Items' },
      { title: 'Adding Items' },
      { title: 'Changing Items' },
    ],
  },
  {
    id: 'loops',
    title: 'Loops',
    icon: Repeat,
    x: C2, y: R2,
    requires: ['lists'],
    description: 'Repeat actions with for and while loops.',
    steps: [
      { title: 'for — lists' },
      { title: 'for — range' },
      { title: 'while loops' },
    ],
  },
  {
    id: 'dicts',
    title: 'Dictionaries',
    icon: BookOpen,
    x: C1, y: R2,
    requires: ['loops'],
    description: 'Store labelled information with keys and values.',
    steps: [
      { title: 'Creating a Dictionary' },
      { title: 'Reading Values' },
      { title: 'Adding Values' },
      { title: 'Iterating' },
      { title: 'Counting' },
    ],
  },
  // Row 3: left → right (snake turn at C1)
  {
    id: 'functions',
    title: 'Functions',
    icon: Code2,
    x: C1, y: R3,
    requires: ['dicts'],
    description: 'Write reusable blocks of code with def.',
    steps: [
      { title: 'Defining a Function' },
      { title: 'Parameters' },
      { title: 'Return Values' },
    ],
  },
]

export const EDGES = NODES.flatMap(node =>
  node.requires.map(req => ({ from: req, to: node.id }))
)

export const NODE_W = 140
export const NODE_H = 52
export const CANVAS_W = 680
export const CANVAS_H = 440
