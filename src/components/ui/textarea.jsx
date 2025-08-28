import React from 'react'
export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full px-3 py-2 text-sm rounded-md border outline-none focus:ring-2 focus:ring-teal-400 ${className}`}
      {...props}
    />
  )
}
export default Textarea
