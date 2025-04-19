"use client"

import type React from "react"

import { forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AccessibleButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  label?: string
  description?: string
}

/**
 * 可访问性按钮组件
 * 扩展基础按钮组件，添加ARIA属性以提高可访问性
 */
export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ label, description, className, children, ...props }, ref) => {
    return (
      <Button ref={ref} className={cn(className)} aria-label={label} aria-description={description} {...props}>
        {children}
      </Button>
    )
  },
)

AccessibleButton.displayName = "AccessibleButton"
