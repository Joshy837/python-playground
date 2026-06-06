import { Tag, GitBranch, List, Repeat, BookOpen, Code2, Lightbulb } from 'lucide-react'

// Diamond branching layout — flows left→right, branches spread up/down.
// Positions are centers (nodeOrigin=[0.5, 0.5]).
export const NODES = [
  {
    id: 'basics',
    title: 'Getting Started',
    icon: Lightbulb,
    x: 60, y: 250,
    requires: [],
    description: 'Learn to show output and leave notes in your code.',
    steps: [
      { title: 'print()' },
      { title: 'Comments' },
    ],
  },
  {
    id: 'variables',
    title: 'Variables',
    icon: Tag,
    x: 220, y: 250,
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
    x: 420, y: 175,
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
    x: 420, y: 325,
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
    x: 620, y: 250,
    requires: ['conditionals', 'lists'],
    description: 'Repeat actions with for and while loops.',
    steps: [
      { title: 'for — lists' },
      { title: 'for — range' },
      { title: 'while loops' },
    ],
  },
  {
    id: 'functions',
    title: 'Functions',
    icon: Code2,
    x: 800, y: 250,
    requires: ['loops'],
    description: 'Write reusable blocks of code with def.',
    steps: [
      { title: 'Defining a Function' },
      { title: 'Parameters' },
      { title: 'Return Values' },
    ],
  },
  {
    id: 'dicts',
    title: 'Dictionaries',
    icon: BookOpen,
    x: 980, y: 250,
    requires: ['functions'],
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
