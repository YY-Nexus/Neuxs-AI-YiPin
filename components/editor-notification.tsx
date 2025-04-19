"use client"

import { useState, useEffect } from "react"
import { Undo2, Redo2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface EditorNotificationProps {
  message: string
  type: "undo" | "redo" | "info"
  onClose: () => void
  duration?: number
}

export function EditorNotification({ message, type, onClose, duration = 2000 }: EditorNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // 等待淡出动画完成后关闭
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 flex items-center gap-2 rounded-md px-4 py-2 shadow-lg transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
        type === "undo" && "bg-blue-900 text-white",
        type === "redo" && "bg-green-900 text-white",
        type === "info" && "bg-slate-800 text-white",
      )}
    >
      {type === "undo" && <Undo2 className="h-4 w-4" />}
      {type === "redo" && <Redo2 className="h-4 w-4" />}
      <span className="text-sm">{message}</span>
    </div>
  )
}
