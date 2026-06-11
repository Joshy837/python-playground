import ModalBase from './ModalBase.jsx'
import SnippetPreview from './SnippetPreview.jsx'

export default function SnippetModal({ snippet, onClose, onLoad, onSave, monacoTheme }) {
  if (!snippet) return null

  return (
    <ModalBase onClose={onClose}>
      {close => (
        <SnippetPreview
          snippet={snippet}
          monacoTheme={monacoTheme}
          onLoad={code => { onLoad(code); close() }}
          onSave={onSave}
          onClose={close}
        />
      )}
    </ModalBase>
  )
}
