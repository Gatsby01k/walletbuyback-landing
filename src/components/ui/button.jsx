import React from 'react'

export function Button({ className = '', asChild = false, children, ...props }) {
  const Comp = asChild ? 'a' : 'button'
  return (
    <Comp
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </Comp>
  )
}
export default Button
