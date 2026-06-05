const cache = new Map()

async function fetchSection(nodeId) {
  if (cache.has(nodeId)) return cache.get(nodeId)
  const res = await fetch(`/lessons/${nodeId}.json`)
  if (!res.ok) throw new Error(`Section not found: ${nodeId}`)
  const data = await res.json()
  cache.set(nodeId, data)
  return data
}

export async function loadStep(nodeId, stepIdx) {
  const data = await fetchSection(nodeId)
  const step = data.steps[stepIdx]
  if (step == null) throw new Error(`Step not found: ${nodeId}/${stepIdx}`)
  return step
}
