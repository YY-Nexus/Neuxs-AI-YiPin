"use client"

import { useState, useEffect } from "react"
import { validatePasswordStrength } from "@/lib/security/input-sanitizer"
import { cn } from "@/lib/utils"

interface PasswordStrengthMeterProps {
  password: string
  className?: string
}

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState(0)
  const [feedback, setFeedback] = useState<string[]>([])

  useEffect(() => {
    if (!password) {
      setStrength(0)
      setFeedback([])
      return
    }

    const result = validatePasswordStrength(password)
    setStrength(result.score)
    setFeedback(result.feedback)
  }, [password])

  const getStrengthLabel = () => {
    if (strength === 0) return "非常弱"
    if (strength === 1) return "弱"
    if (strength === 2) return "中等"
    if (strength === 3) return "强"
    if (strength >= 4) return "非常强"
    return ""
  }

  const getStrengthColor = () => {
    if (strength === 0) return "bg-red-500"
    if (strength === 1) return "bg-orange-500"
    if (strength === 2) return "bg-yellow-500"
    if (strength === 3) return "bg-green-500"
    if (strength >= 4) return "bg-emerald-500"
    return "bg-slate-500"
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">密码强度</span>
        <span
          className={cn(
            "text-xs font-medium",
            strength === 0
              ? "text-red-500"
              : strength === 1
                ? "text-orange-500"
                : strength === 2
                  ? "text-yellow-500"
                  : strength === 3
                    ? "text-green-500"
                    : "text-emerald-500",
          )}
        >
          {getStrengthLabel()}
        </span>
      </div>

      <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-300 ease-in-out", getStrengthColor())}
          style={{ width: `${Math.min(100, strength * 25)}%` }}
        />
      </div>

      {feedback.length > 0 && (
        <ul className="text-xs text-slate-400 space-y-1 mt-2">
          {feedback.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-red-500 mr-1">•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
