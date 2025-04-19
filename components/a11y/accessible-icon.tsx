"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface AccessibleIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string
  icon: React.ReactNode
}

/**
 * 可访问性图标组件
 * 为图标添加屏幕阅读器标签，同时保持视觉呈现
 */
export const AccessibleIcon = forwardRef<HTMLSpanElement, AccessibleIconProps>(
  ({ label, icon, className, ...props }, ref) => {
    return (
      <span ref={ref} className={cn("inline-flex", className)} role="img" aria-label={label} {...props}>
        {icon}
      </span>
    )
  },
)

AccessibleIcon.displayName = "AccessibleIcon"
