import { NODES } from '../data/courseTree.js'
import { useLocalStorage } from './useLocalStorage.js'

export function useProgress() {
  const [stepsDone, setStepsDone] = useLocalStorage('course-progress-v2', {})
  const [quizProgress, setQuizProgress] = useLocalStorage(
    'quiz-progress-v1',
    {}
  )

  function markStepComplete(nodeId, stepIdx) {
    setStepsDone((prev) => {
      const current = prev[nodeId] ?? []
      if (current.includes(stepIdx)) return prev
      return { ...prev, [nodeId]: [...current, stepIdx] }
    })
  }

  function isStepComplete(nodeId, stepIdx) {
    return (stepsDone[nodeId] ?? []).includes(stepIdx)
  }

  function isComplete(nodeId) {
    const node = NODES.find((n) => n.id === nodeId)
    if (!node) return false
    const done = stepsDone[nodeId] ?? []
    return node.steps.every((_, i) => done.includes(i))
  }

  function isUnlocked(nodeId) {
    const node = NODES.find((n) => n.id === nodeId)
    return node ? node.requires.every((req) => isComplete(req)) : false
  }

  function isStepUnlocked(nodeId, stepIdx) {
    if (!isUnlocked(nodeId)) return false
    return stepIdx === 0 || isStepComplete(nodeId, stepIdx - 1)
  }

  function saveQuizProgress(nodeId, stepIdx, answeredCount) {
    const key = `${nodeId}:${stepIdx}`
    setQuizProgress((prev) => ({ ...prev, [key]: answeredCount }))
  }

  function getQuizAnsweredCount(nodeId, stepIdx) {
    return quizProgress[`${nodeId}:${stepIdx}`] ?? 0
  }

  const completed = NODES.filter((n) => isComplete(n.id)).map((n) => n.id)

  return {
    completed,
    stepsDone,
    markStepComplete,
    isStepComplete,
    isStepUnlocked,
    isComplete,
    isUnlocked,
    saveQuizProgress,
    getQuizAnsweredCount,
  }
}
