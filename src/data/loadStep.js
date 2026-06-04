function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n')) return { meta: {}, body: raw }
  const end = raw.indexOf('\n---\n', 4)
  if (end === -1) return { meta: {}, body: raw }
  return {
    meta: JSON.parse(raw.slice(4, end)),
    body: raw.slice(end + 5),
  }
}

export async function loadStep(nodeId, stepIdx) {
  const res = await fetch(`/lessons/${nodeId}/${stepIdx}.md`)
  if (!res.ok) throw new Error(`Step not found: ${nodeId}/${stepIdx}`)
  const { meta, body } = parseFrontmatter(await res.text())
  return { ...meta, description: body.trim() }
}
