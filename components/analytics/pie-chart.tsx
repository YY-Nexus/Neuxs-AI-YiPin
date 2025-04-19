"use client"

import { useEffect, useRef } from "react"

interface DataPoint {
  label: string
  value: number
  color?: string
}

interface PieChartProps {
  data: DataPoint[]
  height?: number
  colors?: string[]
  showLabels?: boolean
  showLegend?: boolean
  className?: string
}

export function PieChart({
  data,
  height = 200,
  colors = ["#3b82f6", "#10b981", "#f97316", "#8b5cf6", "#ec4899", "#eab308"],
  showLabels = true,
  showLegend = true,
  className,
}: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布尺寸
    const setCanvasSize = () => {
      const parent = canvas.parentElement
      if (!parent) return

      canvas.width = parent.clientWidth
      canvas.height = height
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // 绘制图表
    const drawChart = () => {
      if (!ctx) return

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 计算总和
      const total = data.reduce((sum, item) => sum + item.value, 0)

      // 计算圆心和半径
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) - 40

      // 绘制饼图
      let startAngle = 0
      data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI
        const endAngle = startAngle + sliceAngle

        // 绘制扇形
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.closePath()

        // 填充颜色
        const color = item.color || colors[index % colors.length]
        ctx.fillStyle = color
        ctx.fill()

        // 绘制边框
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2
        ctx.stroke()

        // 绘制标签
        if (showLabels) {
          const labelAngle = startAngle + sliceAngle / 2
          const labelRadius = radius * 0.7
          const labelX = centerX + Math.cos(labelAngle) * labelRadius
          const labelY = centerY + Math.sin(labelAngle) * labelRadius

          // 计算百分比
          const percentage = ((item.value / total) * 100).toFixed(1) + "%"

          // 绘制标签
          ctx.fillStyle = "#fff"
          ctx.font = "bold 12px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(percentage, labelX, labelY)
        }

        // 更新起始角度
        startAngle = endAngle
      })

      // 绘制图例
      if (showLegend) {
        const legendY = canvas.height - 30
        let legendX = centerX - (data.length * 80) / 2

        data.forEach((item, index) => {
          const color = item.color || colors[index % colors.length]

          // 绘制图例颜色块
          ctx.fillStyle = color
          ctx.fillRect(legendX, legendY, 10, 10)

          // 绘制图例文字
          ctx.fillStyle = "rgba(148, 163, 184, 0.8)"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "left"
          ctx.textBaseline = "middle"
          ctx.fillText(item.label, legendX + 15, legendY + 5)

          legendX += 80
        })
      }
    }

    drawChart()
    window.addEventListener("resize", drawChart)

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      window.removeEventListener("resize", drawChart)
    }
  }, [data, height, colors, showLabels, showLegend])

  return (
    <div className={className || "w-full h-full relative"}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
