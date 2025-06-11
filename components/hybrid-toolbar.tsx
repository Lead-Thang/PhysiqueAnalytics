// components/hybrid-toolbar.tsx
"use client"

import { useState, useCallback, useRef } from "react"
import { cn } from "@/src/lib/utils"
import type { ToolCategory } from "@/types/tool-category"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronDown, GripVertical, X } from "lucide-react"
import { useEffect as reactUseEffect } from "react"

interface HybridToolbarProps {
  categories: ToolCategory[]
  onToolAction: (action: string) => void
  onToggleCategory: (categoryName: string) => void
  isVisible: boolean
  onToggleVisibility: () => void
  position: { x: number; y: number }
  onPositionChange: (position: { x: number; y: number }) => void
}

export function HybridToolbar({
    categories,
    onToolAction,
    onToggleCategory,
    isVisible,
    onToggleVisibility,
    position,
    onPositionChange,
}: HybridToolbarProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const toolbarRef = useRef<HTMLDivElement>(null)

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!toolbarRef.current) return
        const rect = toolbarRef.current.getBoundingClientRect()
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        })
        setIsDragging(true)
    }

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging) return
            const newX = Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragOffset.x))
            const newY = Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y))
            onPositionChange({ x: newX, y: newY })
        },
        [isDragging, dragOffset]
    )

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove as any)
        return () => window.removeEventListener("mousemove", handleMouseMove as any)
    }, [handleMouseMove])

    return (
        <div
            ref={toolbarRef}
            className={cn(
                "fixed z-50 bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl max-h-[80vh] overflow-y-auto transition-all duration-300",
                !isVisible && "opacity-60 hover:opacity-100 cursor-pointer",
                isVisible ? "w-64" : "w-12 h-12"
            )}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: isVisible ? "16rem" : "3rem",
                height: isVisible ? "auto" : "3rem",
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-2 border-b border-slate-700 cursor-move bg-logo-gradient"
                onMouseDown={handleMouseDown}
                role="button"
                tabIndex={0}
                aria-label="Move toolbar"
            >
                <span className="text-sm font-medium text-white flex items-center">
                    <GripVertical className="h-4 w-4 mr-2 text-white" />
                    Tools
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleVisibility}
                    aria-label={isVisible ? "Minimize toolbar" : "Expand toolbar"}
                    className="h-6 w-6 p-0 text-white hover:bg-white/20"
                >
                    {isVisible ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
            </div>

            {/* Categories */}
            {isVisible && (
                <div className="p-2 space-y-1">
                    {categories.map((category) => (
                        <div key={category.name}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onToggleCategory(category.name)}
                                className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-700"
                            >
                                {category.expanded ? <ChevronDown className="h-3 w-3 mr-2" /> : <ChevronRight className="h-3 w-3 mr-2" />}
                                {category.icon}
                                <span className="ml-2 text-sm">{category.name}</span>
                            </Button>
                            {category.expanded && (
                                <div className="ml-4 mt-1 space-y-1">
                                    {category.tools.map((tool) => (
                                        <Button
                                            key={tool.action}
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onToolAction(tool.action)}
                                            className="w-full justify-start text-gray-400 hover:text-white hover:bg-slate-700 text-xs"
                                        >
                                            {tool.icon}
                                            <span className="ml-2">{tool.name}</span>
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Reasonable implementation of useEffect for this context
function useEffect(effect: () => void | (() => void), deps: any[]) {
    return reactUseEffect(effect, deps)
}
