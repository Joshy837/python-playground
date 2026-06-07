import { useState } from 'react'
import { NODES } from '../data/courseTree.js'

function load() {
  try {
    const raw = localStorage.getItem('course-progress-v2')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function loadQuizProgress() {
  try {
    const raw = localStorage.getItem('quiz-progress-v1')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function useProgress() {
  const [stepsDone, setStepsDone] = useState(load)
  const [quizProgress, setQuizProgress] = useState(loadQuizProgress)

  function markStepComplete(nodeId, stepIdx) {
    setStepsDone(prev => {
      const current = prev[nodeId] ?? []
      if (current.includes(stepIdx)) return prev
      const next = { ...prev, [nodeId]: [...current, stepIdx] }
      localStorage.setItem('course-progress-v2', JSON.stringify(next))
      return next
    })
  }

  function isStepComplete(nodeId, stepIdx) {
    return (stepsDone[nodeId] ?? []).includes(stepIdx)
  }

  function isComplete(nodeId) {
    const node = NODES.find(n => n.id === nodeId)
    if (!node) return false
    const done = stepsDone[nodeId] ?? []
    return node.steps.every((_, i) => done.includes(i))
  }

  function isUnlocked(nodeId) {
    const node = NODES.find(n => n.id === nodeId)
    return node ? node.requires.every(req => isComplete(req)) : false
  }

  function isStepUnlocked(nodeId, stepIdx) {
    if (!isUnlocked(nodeId)) return false
    return stepIdx === 0 || isStepComplete(nodeId, stepIdx - 1)
  }

  function saveQuizProgress(nodeId, stepIdx, answeredCount) {
    const key = `${nodeId}:${stepIdx}`
    setQuizProgress(prev => {
      const next = { ...prev, [key]: answeredCount }
      localStorage.setItem('quiz-progress-v1', JSON.stringify(next))
      return next
    })
  }

  function getQuizAnsweredCount(nodeId, stepIdx) {
    return quizProgress[`${nodeId}:${stepIdx}`] ?? 0
  }

  const completed = NODES.filter(n => isComplete(n.id)).map(n => n.id)

  return { completed, stepsDone, markStepComplete, isStepComplete, isStepUnlocked, isComplete, isUnlocked, saveQuizProgress, getQuizAnsweredCount }
}
