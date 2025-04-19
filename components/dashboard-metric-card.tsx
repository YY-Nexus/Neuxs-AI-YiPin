import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { ReactNode } from "react"

interface DashboardMetricCardProps {
  title: string
  value: string
  change: string
  icon: ReactNode
}

export function DashboardMetricCard({ title, value, change, icon }: DashboardMetricCardProps) {
  const isPositive = change.startsWith("+")

  return (
    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-600/20 to-transparent rounded-bl-3xl" />
      <CardContent className="p-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-gradient-to-br from-blue-700 to-blue-900 border border-blue-600/50">
            {icon}
          </div>
          <span className="text-sm font-medium text-slate-400">{title}</span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div className="text-3xl font-bold text-white">{value}</div>
          <div className={cn("flex items-center text-xs font-medium", isPositive ? "text-green-500" : "text-red-500")}>
            {isPositive ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
            {change}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
