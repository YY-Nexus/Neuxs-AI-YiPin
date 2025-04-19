"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface HexagonButtonProps {
  icon: ReactNode
  label: string
}

export function HexagonButton({ icon, label }: HexagonButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  return (
    <button
      className="group relative w-full aspect-square"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsActive(false)
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
    >
      {/* 六边形背景 */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          "before:content-[''] before:absolute before:inset-0",
          "before:bg-gradient-to-br before:from-slate-800 before:to-blue-900",
          "before:clip-path-hexagon before:transition-all before:duration-300",
          isHovered && !isActive && "before:from-slate-700 before:to-blue-800",
          isActive && "before:from-orange-600 before:to-orange-800",
        )}
      >
        {/* 内部六边形边框 */}
        <div
          className={cn(
            "absolute inset-2",
            "before:content-[''] before:absolute before:inset-0",
            "before:bg-gradient-to-br before:from-blue-600/20 before:to-blue-900/20",
            "before:clip-path-hexagon before:transition-all before:duration-300",
            "before:border before:border-blue-500/30 before:clip-path-hexagon",
            isHovered && !isActive && "before:border-blue-400/50",
            isActive && "before:border-orange-500/50",
          )}
        />
      </div>

      {/* 内容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-2">
        <div
          className={cn(
            "p-2 rounded-md transition-colors duration-300",
            isActive ? "text-white" : "text-blue-300",
            isHovered && !isActive && "text-blue-200",
          )}
        >
          {icon}
        </div>
        <span
          className={cn(
            "text-xs font-medium mt-1 transition-colors duration-300",
            isActive ? "text-white" : "text-slate-400",
            isHovered && !isActive && "text-slate-300",
          )}
        >
          {label}
        </span>
      </div>
    </button>
  )
}
