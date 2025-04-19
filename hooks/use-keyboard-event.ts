"use client"

import { useEffect, useCallback } from "react"

type KeyboardEventHandler = (event: KeyboardEvent) => void

/**
 * 键盘事件钩子
 * 简化键盘事件处理，支持多种键盘事件类型
 */
export function useKeyboardEvent(
  key: string | string[],
  callback: KeyboardEventHandler,
  options: {
    event?: "keydown" | "keyup" | "keypress"
    target?: Window | HTMLElement | null
    enabled?: boolean
    preventDefault?: boolean
  } = {},
) {
  const {
    event = "keydown",
    target = typeof window !== "undefined" ? window : null,
    enabled = true,
    preventDefault = true,
  } = options

  const handleKeyEvent = useCallback(
    (e: KeyboardEvent) => {
      const keys = Array.isArray(key) ? key : [key]
      if (keys.includes(e.key)) {
        if (preventDefault) {
          e.preventDefault()
        }
        callback(e)
      }
    },
    [key, callback, preventDefault],
  )

  useEffect(() => {
    if (!enabled || !target) return

    target.addEventListener(event, handleKeyEvent as EventListener)

    return () => {
      target.removeEventListener(event, handleKeyEvent as EventListener)
    }
  }, [target, event, handleKeyEvent, enabled])
}
