export const BASE_EDITOR_CONFIG = {
  language: 'python',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: false,
  tabSize: 4,
  insertSpaces: true,
  wordWrap: 'on',
}

export function editorHeight(code, { min = 100, max = 300 } = {}) {
  return Math.min(Math.max(code.split('\n').length * 22 + 20, min), max)
}
