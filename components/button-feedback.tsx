"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ButtonFeedbackProps extends React.ComponentPropsWithoutRef<typeof Button> {
  loadingText?: string
  successText?: string
  errorText?: string
  action?: () => Promise<boolean | void>
  onSuccess?: () => void
  onError?: () => void
}

export function ButtonFeedback({
  children,
  loadingText = "处理中...",
  successText = "操作成功",
  errorText = "操作失败",
  action,
  onSuccess,
  onError,
  className,
  ...props
}: ButtonFeedbackProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const { toast } = useToast()

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) {
      props.onClick(e)
    }

    if (!action) return

    try {
      setIsLoading(true)
      setStatus("idle")

      const result = await action()

      setIsLoading(false)
      setStatus("success")

      toast({
        title: successText,
        variant: "default",
      })

      if (onSuccess) onSuccess()

      // 2秒后重置状态
      setTimeout(() => {
        setStatus("idle")
      }, 2000)

      return result
    } catch (error) {
      setIsLoading(false)
      setStatus("error")

      toast({
        title: errorText,
        variant: "destructive",
      })

      if (onError) onError()

      // 2秒后重置状态
      setTimeout(() => {
        setStatus("idle")
      }, 2000)
    }
  }

  return (
    <Button
      className={cn(
        status === "success" && "bg-green-600 hover:bg-green-700",
        status === "error" && "bg-red-600 hover:bg-red-700",
        className,
      )}
      onClick={handleClick}
      disabled={isLoading || status !== "idle"}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
