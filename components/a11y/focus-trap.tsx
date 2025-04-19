"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useKeyboardEvent } from "@/hooks/use-keyboard-event"

interface FocusTrapProps {
  children: React.ReactNode
  active?: boolean
  autoFocus?: boolean
}

/**
 * 焦点陷阱组件
 * 确保键盘焦点在模态框等组件内循环，提高可访问性
 */
export function FocusTrap({ children, active = true, autoFocus = true }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // 处理Tab键导航
  useKeyboardEvent("Tab", (event) => {
    if (!active || !containerRef.current) return

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // 如果按下Shift+Tab且当前焦点在第一个元素上，则移动到最后一个元素
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    }
    // 如果按下Tab且当前焦点在最后一个元素上，则移动到第一个元素
    else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  })

  // 自动聚焦到第一个可聚焦元素
  useEffect(() => {
    if (!active || !autoFocus || !containerRef.current) return

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    if (focusableElements.length > 0) {
      ;(focusableElements[0] as HTMLElement).focus()
    }
  }, [active, autoFocus])

  return (
    <div ref={containerRef} style={{ outline: "none" }}>
      {children}
    </div>
  )
}
