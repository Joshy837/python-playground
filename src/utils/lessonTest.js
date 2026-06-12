export function buildTestCode(userCode, tests) {
  const checks = tests.map(t =>
    `_check(${JSON.stringify(t.name)}, ${t.check}, ${JSON.stringify(t.msg)})`
  ).join('\n')
  return `${userCode}

import json as _json
_results = []

def _check(name, condition, msg=""):
    _results.append({"name": name, "passed": bool(condition), "error": "" if condition else msg})

${checks}

print("__TESTS__:" + _json.dumps(_results))
`
}

export function parseTestResults(stdout) {
  const marker = '__TESTS__:'
  const line = stdout.split('\n').find(l => l.startsWith(marker))
  if (!line) return null
  try { return JSON.parse(line.slice(marker.length)) } catch { return null }
}

export function stripTestLine(stdout) {
  return stdout.split('\n').filter(l => !l.startsWith('__TESTS__:')).join('\n').trimEnd()
}
