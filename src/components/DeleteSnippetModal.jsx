import { Trash2 } from 'lucide-react'
import ModalBase from './ModalBase.jsx'

export default function DeleteSnippetModal({ snippet, onConfirm, onClose }) {
  return (
    <ModalBase
      onClose={onClose}
      className="delete-snippet-modal"
      accentColor="#f87171"
      headerIcon={<Trash2 size={14} style={{ color: '#f87171' }} />}
      title={`Delete "${snippet.label}"?`}
    >
      {close => (
        <div className="flex flex-col gap-[0.3rem] p-4 pb-[0.9rem]">
          <p className="text-[0.75rem] text-app-muted mb-2">This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <button
              className="py-[0.4rem] px-[0.85rem] rounded-[7px] border border-app-border bg-transparent text-app-muted text-[0.8rem] font-medium cursor-pointer transition-[color,background-color] duration-150 hover:text-app-fg hover:bg-app-btn"
              onClick={close}
            >
              Cancel
            </button>
            <button
              className="flex items-center gap-[0.35rem] py-[0.4rem] px-[0.85rem] rounded-[7px] border border-[color-mix(in_srgb,#f87171_40%,transparent)] bg-[color-mix(in_srgb,#f87171_15%,transparent)] text-[#f87171] text-[0.8rem] font-semibold cursor-pointer transition-[background-color] duration-150 hover:bg-[color-mix(in_srgb,#f87171_25%,transparent)]"
              onClick={() => { onConfirm(); close() }}
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </div>
      )}
    </ModalBase>
  )
}
