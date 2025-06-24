"use client"

import { cn } from "src/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center h-full w-full min-h-[60px] gap-3", className)}>
      <div className={cn("animate-spin rounded-full border-muted border-t-logo-purple", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  )
}

// Keep the default export for backward compatibility
export default LoadingSpinner
