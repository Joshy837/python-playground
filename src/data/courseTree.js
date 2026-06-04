import { Tag, GitBranch, List, Repeat, BookOpen } from 'lucide-react'

export const NODES = [
  {
    id: 'variables',
    title: 'Variables & Types',
    icon: Tag,
    x: 100, y: 200,
    requires: [],
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
    x: 320, y: 120,
    requires: ['variables'],
    description: 'Make decisions in your code with if, elif, and else.',
    steps: [
      { title: 'Comparing Things' },
      { title: 'if' },
      { title: 'if / else' },
      { title: 'elif' },
    ],
  },
  {
    id: 'lists',
    title: 'Lists',
    icon: List,
    x: 320, y: 280,
    requires: ['variables'],
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
    x: 540, y: 120,
    requires: ['conditionals'],
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
    x: 540, y: 280,
    requires: ['lists'],
    description: 'Store labelled information with keys and values.',
    steps: [
      { title: 'Creating a Dictionary' },
      { title: 'Reading Values' },
      { title: 'Adding Values' },
      { title: 'Iterating' },
      { title: 'Counting' },
    ],
  },
]

export const EDGES = NODES.flatMap(node =>
  node.requires.map(req => ({ from: req, to: node.id }))
)

export const NODE_W = 140
export const NODE_H = 52
export const CANVAS_W = 680
export const CANVAS_H = 400
