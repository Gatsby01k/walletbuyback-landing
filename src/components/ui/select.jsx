// src/components/ui/select.jsx
import React, {createContext, useContext, useEffect, useMemo, useRef, useState} from "react"
import ReactDOM from "react-dom"

const Ctx = createContext(null)

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const [label, setLabel] = useState(null)

  const ctx = useMemo(() => ({
    open, setOpen,
    value, onValueChange,
    anchorRef,
    label, setLabel,
  }), [open, value, onValueChange, label])

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>
}

export const SelectTrigger = React.forwardRef(function SelectTrigger(
  { className = "", children, ...props },
  ref
) {
  const { open, setOpen, anchorRef } = useContext(Ctx) || {}
  const mergedRef = useMergedRefs(anchorRef, ref)
  return (
    <button
      type="button"
      ref={mergedRef}
      onClick={() => setOpen && setOpen(!open)}
      className={`w-full text-left ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})

export function SelectValue({ placeholder }) {
  const { label } = useContext(Ctx) || {}
  return (
    <div className="text-sm py-2 px-3">
      {label || placeholder}
    </div>
  )
}

export function SelectContent({ className = "", children }) {
  const { open, setOpen, anchorRef } = useContext(Ctx) || {}
  const contentRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (!open) return
      if (anchorRef?.current?.contains?.(e.target)) return
      if (contentRef.current && !contentRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [open, setOpen, anchorRef])

  if (!open || !anchorRef?.current) return null

  const r = anchorRef.current.getBoundingClientRect()
  const style = {
    position: "absolute",
    top: r.bottom + window.scrollY + 6,
    left: r.left + window.scrollX,
    width: r.width,
    zIndex: 1000,
  }

  return ReactDOM.createPortal(
    <div
      ref={contentRef}
      style={style}
      className={
        // фон + тени + скролл + нормальные цвета текста
        "rounded-xl shadow-2xl border " +
        "bg-white text-gray-900 " +
        "dark:bg-[#0b1020] dark:text-gray-100 dark:border-white/10 " +
        "max-h-[280px] overflow-y-auto " + className
      }
      role="listbox"
    >
      <div className="py-1">{children}</div>
    </div>,
    document.body
  )
}

export function SelectItem({ value, children }) {
  const { onValueChange, setOpen, setLabel } = useContext(Ctx) || {}
  return (
    <div
      role="option"
      onClick={() => {
        onValueChange && onValueChange(value)
        const text = typeof children === "string" ? children : getText(children)
        setLabel && setLabel(text)
        setOpen && setOpen(false)
      }}
      className={
        "px-3 py-2 text-sm cursor-pointer " +
        "hover:bg-black/5 dark:hover:bg-white/10 " +
        "text-gray-900 dark:text-gray-100"
      }
    >
      {children}
    </div>
  )
}

/* ---------- утилиты ---------- */
function useMergedRefs(...refs) {
  return (node) => refs.forEach(r => {
    if (!r) return
    if (typeof r === "function") r(node)
    else r.current = node
  })
}
function getText(node) {
  if (typeof node === "string") return node
  if (Array.isArray(node)) return node.map(getText).join("")
  if (node && node.props && node.props.children) return getText(node.props.children)
  return ""
}
export default Select
