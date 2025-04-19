"use client"

import type React from "react"

import { forwardRef, useState } from "react"
import { cn } from "@/lib/utils"

interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  contentId?: string
}

/**
 * 跳过导航链接组件
 * 允许键盘用户直接跳转到主要内容，提高导航效率
 */
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ contentId = "main-content", className, children = "跳到主要内容", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
      <a
        ref={ref}
        href={`#${contentId}`}
        className={cn(
          "fixed top-4 left-4 z-50 bg-slate-900 text-white px-4 py-2 rounded-md shadow-lg transition-opacity",
          isFocused ? "opacity-100" : "opacity-0 pointer-events-none",
          className,
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      >
        {children}
      </a>
    )
  },
)

SkipLink.displayName = "SkipLink"
