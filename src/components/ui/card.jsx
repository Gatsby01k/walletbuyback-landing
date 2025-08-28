import React from "react"

export function Card({ className = "", children }) {
  return <div className={className}>{children}</div>
}
export function CardHeader({ className = "", children }) {
  return <div className={`p-4 border-b border-white/10 dark:border-white/10 ${className}`}>{children}</div>
}
export function CardContent({ className = "", children }) {
  return <div className={`p-4 ${className}`}>{children}</div>
}
export function CardFooter({ className = "", children }) {
  return <div className={`p-4 border-t border-white/10 dark:border-white/10 ${className}`}>{children}</div>
}
export default Card
