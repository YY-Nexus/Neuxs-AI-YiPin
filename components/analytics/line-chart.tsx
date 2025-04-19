"use client"

import { useEffect, useRef } from "react"

interface DataPoint {
  date: string
  value: number
}

interface LineChartProps {
  data: DataPoint[]
  height?: number
  color?: string
  showPoints?: boolean
  showArea?: boolean
  showGrid?: boolean
  showLabels?: boolean
  className?: string
}

export function LineChart({
  data,
  height = 200,
  color = "#3b82f6",
  showPoints = true,
  showArea = true,
  showGrid = true,
  showLabels = true,
  className,
}: LineChartProps) {
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

        // 只显示部分标签，避免拥挤
        const step = Math.max(1, Math.floor(data.length / 5))
        for (let i = 0; i < data.length; i += step) {
          const x = padding + (chartWidth / (data.length - 1)) * i
          const date = new Date(data[i].date)
          const label = `${date.getMonth() + 1}/${date.getDate()}`
          ctx.fillText(label, x, canvas.height - padding + 5)
        }
      }

      // 绘制数据线
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      // 绘制数据点和连线
      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const normalizedValue = (point.value - minValue) / (range || 1)
        const y = canvas.height - padding - normalizedValue * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // 绘制渐变填充
      if (showArea) {
        const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding)
        gradient.addColorStop(0, `${color}50`) // 50 = 透明度 0.3
        gradient.addColorStop(1, `${color}10`) // 10 = 透明度 0.06

        ctx.fillStyle = gradient
        ctx.beginPath()

        // 起点
        ctx.moveTo(padding, canvas.height - padding)

        // 绘制数据点路径
        data.forEach((point, index) => {
          const x = padding + (chartWidth / (data.length - 1)) * index
          const normalizedValue = (point.value - minValue) / (range || 1)
          const y = canvas.height - padding - normalizedValue * chartHeight

          ctx.lineTo(x, y)
        })

        // 闭合路径
        ctx.lineTo(canvas.width - padding, canvas.height - padding)
        ctx.closePath()
        ctx.fill()
      }

      // 绘制数据点
      if (showPoints) {
        ctx.fillStyle = color
        data.forEach((point, index) => {
          const x = padding + (chartWidth / (data.length - 1)) * index
          const normalizedValue = (point.value - minValue) / (range || 1)
          const y = canvas.height - padding - normalizedValue * chartHeight

          ctx.beginPath()
          ctx.arc(x, y, 3, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = "#1e3a8a"
          ctx.lineWidth = 1
          ctx.stroke()
        })
      }
    }

    drawChart()
    window.addEventListener("resize", drawChart)

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      window.removeEventListener("resize", drawChart)
    }
  }, [data, height, color, showPoints, showArea, showGrid, showLabels])

  return (
    <div className={className || "w-full h-full relative"}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
