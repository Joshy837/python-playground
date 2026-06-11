import { useLocalStorage } from './useLocalStorage.js'

const SNIPPETS_KEY = 'playground-saved-snippets-v1'
export const PENDING_KEY = 'playground-pending-load'

export function useSnippetManagement() {
  const [savedSnippets, setSavedSnippets] = useLocalStorage(SNIPPETS_KEY, [])

  function addSnippet(name, description, code) {
    setSavedSnippets(prev => [...prev, { id: Date.now(), label: name, description, code }])
  }

  function updateSnippet(id, code) {
    setSavedSnippets(prev => prev.map(s => s.id === id ? { ...s, code } : s))
  }

  function deleteSnippet(id) {
    setSavedSnippets(prev => prev.filter(s => s.id !== id))
  }

  return { savedSnippets, addSnippet, updateSnippet, deleteSnippet }
}
