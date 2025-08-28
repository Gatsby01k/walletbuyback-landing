import React, {useEffect, useRef, useState} from "react"

export function Select({ value, onValueChange, children }) {
  // просто обёртка для совместимости
  return <div data-select-root>{React.Children.only(children)}</div>
}

export function SelectTrigger({ className = "", children, onClick, ...props }) {
  return (
    <button
      type="button"
      className={`w-full text-left ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export function SelectValue({ placeholder, valueLabel }) {
  return (
    <div className="text-sm py-2 px-3">
      {valueLabel || placeholder}
    </div>
  )
}

/**
 * Портал для контента, чтобы меню не ломало верстку карточки
 */
function Portal({ children }) {
  const ref = useRef(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  if (!ref.current) ref.current = document.body
  return React.createPortal(children, ref.current)
}

export function SelectContent({ className = "", anchorRef, open, onClose, children }) {
  const contentRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (!open) return
      if (!contentRef.current) return
      if (anchorRef?.current?.contains?.(e.target)) return
      if (!contentRef.current.contains(e.target)) onClose?.()
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [open, onClose, anchorRef])

  if (!open || !anchorRef?.current) return null

  const r = anchorRef.current.getBoundingClientRect()
  const style = {
    position: "absolute",
    top: r.bottom + window.scrollY + 6,
    left: r.left + window.scrollX,
    width: r.width,
    zIndex: 50,
  }

  return (
    <Portal>
      <div ref={contentRef} style={style}
           className={`rounded-md shadow-lg border bg-white dark:bg-[#0b1020] dark:border-white/10 ${className}`}>
        {children}
      </div>
    </Portal>
  )
}

export function SelectItem({ value, children, onSelect }) {
  return (
    <div
      role="option"
      onClick={() => onSelect?.(value)}
      className="px-3 py-2 text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
    >
      {children}
    </div>
  )
}

/** Удобная «сборка» под твоё использование в App.tsx */
export function ControlledSelect({ value, onValueChange, options = [], placeholder = "Выберите сеть", className = "" }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const current = options.find(o => o.value === value)

  return (
    <div className="relative">
      <Select>
        <SelectTrigger
          ref={btnRef}
          onClick={() => setOpen(v => !v)}
          className={`w-full ${className}`}
        >
          <div className="w-full px-3 py-2 text-sm rounded-xl border dark:border-white/10 border-gray-300 bg-white dark:bg-[#0b1020]">
            {current?.label || placeholder}
          </div>
        </SelectTrigger>

        <SelectContent open={open} onClose={() => setOpen(false)} anchorRef={btnRef}>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value} onSelect={(v) => { onValueChange?.(v); setOpen(false) }}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default ControlledSelect
