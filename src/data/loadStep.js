const cache = new Map()

function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n')) return { meta: {}, body: raw }
  const end = raw.indexOf('\n---\n', 4)
  if (end === -1) return { meta: {}, body: raw }
  return {
    meta: JSON.parse(raw.slice(4, end)),
    body: raw.slice(end + 5),
  }
}

async function fetchSection(nodeId) {
  if (cache.has(nodeId)) return cache.get(nodeId)
  const res = await fetch(`/lessons/${nodeId}.md`)
  if (!res.ok) throw new Error(`Section not found: ${nodeId}`)
  const text = await res.text()
  cache.set(nodeId, text)
  return text
}

export async function loadStep(nodeId, stepIdx) {
  const text = await fetchSection(nodeId)
  const steps = text.split('\n---step---\n')
  const raw = steps[stepIdx]
  if (raw == null) throw new Error(`Step not found: ${nodeId}/${stepIdx}`)
  const { meta, body } = parseFrontmatter(raw.trim())
  return { ...meta, description: body.trim() }
}
