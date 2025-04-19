"use client"

import { useEffect, useRef } from "react"

interface DataPoint {
  label: string
  value: number
}

interface BarChartProps {
  data: DataPoint[]
  height?: number
  color?: string
  showGrid?: boolean
  showLabels?: boolean
  className?: string
}

export function BarChart({
  data,
  height = 200,
  color = "#3b82f6",
  showGrid = true,
  showLabels = true,
  className,
}: BarChartProps) {
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

      // 数据点
      const values = data.map((d) => d.value)
      const maxValue = Math.max(...values) * 1.1 // 增加10%的空间
      const minValue = Math.min(0, ...values) // 确保包含0
      const range = maxValue - minValue

      // 图表区域
      const padding = 20
      const chartWidth = canvas.width - padding * 2
      const chartHeight = canvas.height - padding * 2

      // 绘制网格线
      if (showGrid) {
        ctx.strokeStyle = "rgba(100, 116, 139, 0.2)"
        ctx.lineWidth = 1

        // 水平网格线
        for (let i = 0; i <= 4; i++) {
          const y = padding + (chartHeight / 4) * i
          ctx.beginPath()
          ctx.moveTo(padding, y)
          ctx.lineTo(canvas.width - padding, y)
          ctx.stroke()
        }
      }

      // 绘制标签
      if (showLabels) {
        ctx.fillStyle = "rgba(148, 163, 184, 0.8)"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"

        // Y轴标签
        for (let i = 0; i <= 4; i++) {
          const y = padding + (chartHeight / 4) * i
          const value = maxValue - (range / 4) * i
          ctx.fillText(value.toFixed(0), 5, y)
        }

        // X轴标签
        ctx.textAlign = "center"
        ctx.textBaseline = "top"

        // 计算柱状图宽度
        const barWidth = (chartWidth / data.length) * 0.7
        const barSpacing = (chartWidth / data.length) * 0.3

        data.forEach((point, index) => {
          const x = padding + (chartWidth / data.length) * index + barWidth / 2 + barSpacing / 2
          ctx.fillText(point.label, x, canvas.height - padding + 5)
        })
      }

      // 绘制柱状图
      const barWidth = (chartWidth / data.length) * 0.7
      const barSpacing = (chartWidth / data.length) * 0.3

      data.forEach((point, index) => {
        const x = padding + (chartWidth / data.length) * index + barSpacing / 2
        const normalizedValue = (point.value - minValue) / (range || 1)
        const barHeight = normalizedValue * chartHeight
        const y = canvas.height - padding - barHeight

        // 创建渐变
        const gradient = ctx.createLinearGradient(x, y, x, canvas.height - padding)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, `${color}80`) // 80 = 透明度 0.5

        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth, barHeight)

        // 添加边框
        ctx.strokeStyle = `${color}80`
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, barWidth, barHeight)
      })
    }

    drawChart()
    window.addEventListener("resize", drawChart)

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      window.removeEventListener("resize", drawChart)
    }
  }, [data, height, color, showGrid, showLabels])

  return (
    <div className={className || "w-full h-full relative"}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
