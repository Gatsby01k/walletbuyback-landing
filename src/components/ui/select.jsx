import React, { useState } from 'react'

export function Select({ value, onValueChange, children }) {
  return <div data-select-root>{children}</div>
}
export function SelectTrigger({ className = '', children }) {
  return <div className={`relative ${className}`}>{children}</div>
}
export function SelectValue({ placeholder }) {
  return <div className="text-sm py-2 px-3">{placeholder}</div>
}
export function SelectContent({ className = '', children }) {
  return <div className={`rounded-md mt-2 ${className}`}>{children}</div>
}
export function SelectItem({ value, children, onSelect }) {
  return (
    <div
      onClick={() => onSelect ? onSelect(value) : null}
      className="px-3 py-2 hover:bg-black/5 cursor-pointer text-sm"
    >
      {children}
    </div>
  )
}

// convenience "controlled" Select wrapper for this demo:
export default function ControlledSelect({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false)
  const items = React.Children.toArray(children).filter(Boolean)
  const current = items.find(el => el.props?.value === value)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left"
      >
        <div className="w-full px-3 py-2 text-sm rounded-md border">{current?.props?.children || 'Выберите'}</div>
      </button>
      {open && (
        <div className="absolute z-20 w-full bg-white shadow border rounded-md mt-1">
          {items.map((el, i) => React.cloneElement(el, { key: i, onSelect: (v) => { onValueChange?.(v); setOpen(false) } }))}
        </div>
      )}
    </div>
  )
}
