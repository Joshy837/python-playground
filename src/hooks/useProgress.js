import { useState } from 'react'
import { NODES } from '../data/courseTree.js'

function load() {
  try {
    return JSON.parse(localStorage.getItem('course-progress') || '[]')
  } catch {
    return []
  }
}

export function useProgress() {
  const [completed, setCompleted] = useState(load)

  function markComplete(id) {
    setCompleted(prev => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      localStorage.setItem('course-progress', JSON.stringify(next))
      return next
    })
  }

  function isComplete(id) {
    return completed.includes(id)
  }

  function isUnlocked(id) {
    const node = NODES.find(n => n.id === id)
    return node ? node.requires.every(req => completed.includes(req)) : false
  }

  return { completed, markComplete, isComplete, isUnlocked }
}
