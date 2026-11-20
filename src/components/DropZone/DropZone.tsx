import { useRef, useState, type DragEvent } from 'react'

interface DropZoneProps {
  accept: string
  selectedFile: File | null
  onSelect: (file: File) => void
}

export const DropZone = ({ accept, selectedFile, onSelect }: DropZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDraggedOver, setIsDraggedOver] = useState(false)

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setIsDraggedOver(false)
    const file = event.dataTransfer.files[0]
    if (file) onSelect(file)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDraggedOver(true)
        }}
        onDragLeave={() => setIsDraggedOver(false)}
        onDrop={handleDrop}
        className={`group grid w-full cursor-pointer place-items-center gap-2 rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-all duration-200 ${
          isDraggedOver
            ? 'scale-[1.01] border-accent-bright bg-[var(--accent-glow)]'
            : 'border-hairline-strong bg-surface-sunken hover:border-accent hover:bg-[var(--accent-glow)]'
        }`}
      >
        <span
          className="grid size-11 place-items-center rounded-full transition-transform duration-200 group-hover:-translate-y-0.5"
          style={{ background: 'var(--accent-glow)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
              stroke="var(--accent)"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="font-semibold">
          {selectedFile ? selectedFile.name : 'Drop your CSV file here'}
        </span>
        <span className="text-[13px] text-ink-soft">
          {selectedFile
            ? 'Click to choose a different file'
            : 'One column named “email”. Up to 100,000 addresses.'}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onSelect(file)
        }}
      />
    </>
  )
}
