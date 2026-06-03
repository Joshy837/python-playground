import * as monaco from 'monaco-editor'

const DEFAULT_CODE = `# Write your Python code here and press Run (or Ctrl+Enter / Cmd+Enter)
print("Hello, World!")
`

export function setupEditor(containerId, onRun) {
  const editor = monaco.editor.create(document.getElementById(containerId), {
    value: DEFAULT_CODE,
    language: 'python',
    theme: 'vs-dark',
    fontSize: 14,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    padding: { top: 16, bottom: 16 },
    tabSize: 4,
    insertSpaces: true,
    wordWrap: 'on',
  })

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, onRun)

  return editor
}

export function getValue(editor) {
  return editor.getValue()
}

export function setValue(editor, code) {
  editor.setValue(code)
}

export function setTheme(themeId) {
  monaco.editor.setTheme(themeId)
}
