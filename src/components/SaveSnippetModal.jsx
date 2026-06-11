import { useState, useEffect, useRef } from 'react'
import { BookmarkPlus } from 'lucide-react'
import ModalBase from './ModalBase.jsx'

const DESC_MAX = 60

export default function SaveSnippetModal({ defaultName, defaultDescription = '', isEdit = false, onSave, onClose }) {
  const [name, setName] = useState(defaultName)
  const [description, setDescription] = useState(defaultDescription)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  function handleSave(close) {
    onSave(name.trim() || defaultName, description.trim())
    close()
  }

  return (
    <ModalBase
      onClose={onClose}
      className="save-snippet-modal"
      headerIcon={<BookmarkPlus size={15} style={{ color: 'var(--accent)' }} />}
      title={isEdit ? 'Edit Snippet' : 'Add to Drawer'}
    >
      {close => (
        <div className="flex flex-col gap-[0.6rem] px-4 pt-[1.1rem] pb-4">
          <label className="text-[0.75rem] font-medium text-app-muted flex justify-between items-baseline">Snippet name</label>
          <input
            ref={inputRef}
            className="w-full py-2 px-[0.7rem] rounded-[8px] border border-app-border bg-app-bg text-app-fg text-[0.875rem] outline-none transition-[border-color] duration-150 focus:border-app-muted"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && e.target === inputRef.current) handleSave(close) }}
            placeholder={defaultName}
            maxLength={60}
          />
          <label className="text-[0.75rem] font-medium text-app-muted flex justify-between items-baseline">
            Description
            <span className="text-[0.7rem] text-app-muted opacity-70">{description.length}/{DESC_MAX}</span>
          </label>
          <textarea
            className="w-full py-2 px-[0.7rem] rounded-[8px] border border-app-border bg-app-bg text-app-fg text-[0.875rem] outline-none transition-[border-color] duration-150 focus:border-app-muted resize-none font-[inherit] leading-[1.5]"
            value={description}
            onChange={e => setDescription(e.target.value.slice(0, DESC_MAX))}
            placeholder="Optional — what does this snippet do?"
            rows={2}
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              className="py-[0.4rem] px-[0.85rem] rounded-[7px] border border-app-border bg-transparent text-app-muted text-[0.8rem] font-medium cursor-pointer transition-[color,background-color] duration-150 hover:text-app-fg hover:bg-app-btn"
              onClick={close}
            >
              Cancel
            </button>
            <button
              className="flex items-center gap-[0.35rem] py-[0.4rem] px-[0.85rem] rounded-[7px] border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)] text-[0.8rem] font-semibold cursor-pointer transition-[background-color] duration-150 hover:bg-[color-mix(in_srgb,var(--accent)_25%,transparent)]"
              onClick={() => handleSave(close)}
            >
              <BookmarkPlus size={13} />
              {isEdit ? 'Save Changes' : 'Add to Drawer'}
            </button>
          </div>
        </div>
      )}
    </ModalBase>
  )
}
