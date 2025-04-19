"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { ReactNode } from "react"

interface MetricCardProps {
  title: string
  value: string
  change: string
  icon: ReactNode
  className?: string
  trend?: "up" | "down" | "neutral"
  loading?: boolean
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  className,
  trend = "neutral",
  loading = false,
}: MetricCardProps) {
  const isPositive = trend === "up" || change.startsWith("+")
  const isNegative = trend === "down" || change.startsWith("-")

  return (
    <Card className={cn("bg-slate-900/60 border-slate-800 backdrop-blur-sm overflow-hidden relative", className)}>
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-600/20 to-transparent rounded-bl-3xl" />
      <CardContent className="p-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-gradient-to-br from-blue-700 to-blue-900 border border-blue-600/50">
            {icon}
          </div>
          <span className="text-sm font-medium text-slate-400">{title}</span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          {loading ? (
            <div className="h-8 w-24 bg-slate-800 animate-pulse rounded"></div>
          ) : (
            <div className="text-3xl font-bold text-white">{value}</div>
          )}

          {loading ? (
            <div className="h-5 w-16 bg-slate-800 animate-pulse rounded"></div>
          ) : (
            <div
              className={cn(
                "flex items-center text-xs font-medium",
                isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-slate-400",
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="mr-1 h-3 w-3" />
              ) : isNegative ? (
                <ArrowDownRight className="mr-1 h-3 w-3" />
              ) : null}
              {change}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
