import { PENDING_KEY } from '../hooks/useSnippetManagement.js'

export const STORAGE_KEY = 'playground-editor-v1'

export const DEFAULT_CODE = `# Write your Python code here and press Run (or Ctrl+Enter / Cmd+Enter)
print("Hello, World!")
`

export function loadSavedCode() {
  try {
    const pending = localStorage.getItem(PENDING_KEY)
    if (pending !== null) {
      localStorage.removeItem(PENDING_KEY)
      return pending
    }
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_CODE
  } catch {
    return DEFAULT_CODE
  }
}
