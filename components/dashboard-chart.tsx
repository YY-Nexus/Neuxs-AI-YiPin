"use client"

import { useEffect, useRef } from "react"

export function DashboardChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布尺寸
    const setCanvasSize = () => {
      const parent = canvas.parentElement
      if (!parent) return

      canvas.width = parent.clientWidth
      canvas.height = 200
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // 绘制图表
    const drawChart = () => {
      if (!ctx) return

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 数据点
      const data = [25, 40, 30, 50, 45, 60, 70, 55, 65, 75, 85, 80]
      const maxData = Math.max(...data)
      const minData = Math.min(...data)
      const range = maxData - minData

      // 图表区域
      const padding = 20
      const chartWidth = canvas.width - padding * 2
      const chartHeight = canvas.height - padding * 2

      // 绘制网格线
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

      // 绘制数据线
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.beginPath()

      // 绘制数据点和连线
      data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const normalizedValue = (value - minData) / (range || 1)
        const y = canvas.height - padding - normalizedValue * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // 绘制渐变填充
      const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding)
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.5)")
      gradient.addColorStop(1, "rgba(59, 130, 246, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()

      // 起点
      ctx.moveTo(padding, canvas.height - padding)

      // 绘制数据点路径
      data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const normalizedValue = (value - minData) / (range || 1)
        const y = canvas.height - padding - normalizedValue * chartHeight

        ctx.lineTo(x, y)
      })

      // 闭合路径
      ctx.lineTo(canvas.width - padding, canvas.height - padding)
      ctx.closePath()
      ctx.fill()

      // 绘制数据点
      ctx.fillStyle = "#3b82f6"
      data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const normalizedValue = (value - minData) / (range || 1)
        const y = canvas.height - padding - normalizedValue * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = "#1e3a8a"
        ctx.lineWidth = 1
        ctx.stroke()
      })
    }

    drawChart()
    window.addEventListener("resize", drawChart)

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      window.removeEventListener("resize", drawChart)
    }
  }, [])

  return (
    <div className="w-full h-[200px] relative">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
