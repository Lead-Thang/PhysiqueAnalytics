"use client"

import { cn } from "src/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
}

export function FeatureCardSkeleton() {
  return (
    <div className="feature-card p-8 rounded-xl bg-white">
      <Skeleton className="w-12 h-12 mb-4 rounded-lg" />
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

export function ModelViewerSkeleton() {
  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-300 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-gray-600 text-sm">Initializing 3D Viewer...</p>
      </div>
    </div>
  )
}
