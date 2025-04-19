"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, ZoomIn, ZoomOut, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// 图表类型
type ChartType = "line" | "bar" | "area" | "pie"

// 图表数据接口
interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string
    borderWidth?: number
    fill?: boolean
  }[]
}

interface AdvancedChartProps {
  title: string
  description?: string
  data: ChartData
  type?: ChartType
  height?: number
  allowDownload?: boolean
  allowZoom?: boolean
  allowTypeChange?: boolean
  isLoading?: boolean
  onRefresh?: () => void
}

export function AdvancedChart({
  title,
  description,
  data,
  type = "line",
  height = 300,
  allowDownload = true,
  allowZoom = true,
  allowTypeChange = true,
  isLoading = false,
  onRefresh,
}: AdvancedChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chartType, setChartType] = useState<ChartType>(type)
  const [zoomLevel, setZoomLevel] = useState(1)
  const { toast } = useToast()

  // 模拟图表渲染
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
      canvas.height = height * zoomLevel
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // 绘制图表
    const drawChart = () => {
      if (!ctx) return

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 根据图表类型绘制不同的图表
      switch (chartType) {
        case "line":
          drawLineChart(ctx, data, canvas.width, canvas.height)
          break
        case "bar":
          drawBarChart(ctx, data, canvas.width, canvas.height)
          break
        case "area":
          drawAreaChart(ctx, data, canvas.width, canvas.height)
          break
        case "pie":
          drawPieChart(ctx, data, canvas.width, canvas.height)
          break
      }
    }

    drawChart()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
    }
  }, [data, chartType, height, zoomLevel])

  // 绘制线图
  const drawLineChart = (ctx: CanvasRenderingContext2D, data: ChartData, width: number, height: number) => {
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // 找出数据的最大值和最小值
    const allValues = data.datasets.flatMap((dataset) => dataset.data)
    const maxValue = Math.max(...allValues)
    const minValue = Math.min(...allValues, 0)
    const range = maxValue - minValue

    // 绘制坐标轴
    ctx.strokeStyle = "rgba(100, 116, 139, 0.5)"
    ctx.lineWidth = 1

    // X轴
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Y轴
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // 绘制网格线和标签
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.font = "10px sans-serif"
    ctx.fillStyle = "rgba(148, 163, 184, 0.8)"

    // 水平网格线和Y轴标签
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      const value = maxValue - (maxValue - minValue) * (i / 5)

      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.strokeStyle = "rgba(100, 116, 139, 0.1)"
      ctx.stroke()

      ctx.fillText(value.toFixed(0), padding - 5, y)
    }

    // X轴标签
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    const step = Math.ceil(data.labels.length / 10) // 最多显示10个标签
    for (let i = 0; i < data.labels.length; i += step) {
      const x = padding + (chartWidth / (data.labels.length - 1)) * i
      ctx.fillText(data.labels[i], x, height - padding + 5)
    }

    // 绘制每个数据集
    data.datasets.forEach((dataset, datasetIndex) => {
      ctx.strokeStyle = dataset.borderColor || getColor(datasetIndex)
      ctx.lineWidth = 2
      ctx.beginPath()

      // 绘制线
      data.labels.forEach((_, index) => {
        const x = padding + (chartWidth / (data.labels.length - 1)) * index
        const normalizedValue = (dataset.data[index] - minValue) / (range || 1)
        const y = height - padding - normalizedValue * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // 绘制点
      ctx.fillStyle = dataset.borderColor || getColor(datasetIndex)
      data.labels.forEach((_, index) => {
        const x = padding + (chartWidth / (data.labels.length - 1)) * index
        const normalizedValue = (dataset.data[index] - minValue) / (range || 1)
        const y = height - padding - normalizedValue * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      })
    })

    // 绘制图例
    const legendY = padding / 2
    let legendX = padding

    data.datasets.forEach((dataset, index) => {
      const color = dataset.borderColor || getColor(index)

      // 绘制图例颜色块
      ctx.fillStyle = color
      ctx.fillRect(legendX, legendY - 5, 10, 10)

      // 绘制图例文字
      ctx.fillStyle = "rgba(148, 163, 184, 0.8)"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(dataset.label, legendX + 15, legendY)

      legendX += ctx.measureText(dataset.label).width + 40
    })
  }

  // 绘制柱状图
  const drawBarChart = (ctx: CanvasRenderingContext2D, data: ChartData, width: number, height: number) => {
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // 找出数据的最大值和最小值
    const allValues = data.datasets.flatMap((dataset) => dataset.data)
    const maxValue = Math.max(...allValues)
    const minValue = Math.min(...allValues, 0)
    const range = maxValue - minValue

    // 绘制坐标轴
    ctx.strokeStyle = "rgba(100, 116, 139, 0.5)"
    ctx.lineWidth = 1

    // X轴
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Y轴
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // 绘制网格线和标签
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.font = "10px sans-serif"
    ctx.fillStyle = "rgba(148, 163, 184, 0.8)"

    // 水平网格线和Y轴标签
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      const value = maxValue - (maxValue - minValue) * (i / 5)

      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.strokeStyle = "rgba(100, 116, 139, 0.1)"
      ctx.stroke()

      ctx.fillText(value.toFixed(0), padding - 5, y)
    }

    // X轴标签
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    const step = Math.ceil(data.labels.length / 10) // 最多显示10个标签
    for (let i = 0; i < data.labels.length; i += step) {
      const x = padding + (chartWidth / (data.labels.length - 1)) * i
      ctx.fillText(data.labels[i], x, height - padding + 5)
    }

    // 计算柱状图宽度
    const barWidth = ((chartWidth / data.labels.length) * 0.8) / data.datasets.length
    const groupWidth = barWidth * data.datasets.length
    const barSpacing = (chartWidth / data.labels.length) * 0.2

    // 绘制每个数据集
    data.datasets.forEach((dataset, datasetIndex) => {
      ctx.fillStyle = dataset.backgroundColor || getColor(datasetIndex)

      // 绘制柱状图
      data.labels.forEach((_, index) => {
        const groupX = padding + (chartWidth / data.labels.length) * index + barSpacing / 2
        const x = groupX + barWidth * datasetIndex
        const normalizedValue = (dataset.data[index] - minValue) / (range || 1)
        const barHeight = normalizedValue * chartHeight
        const y = height - padding - barHeight

        ctx.fillRect(x, y, barWidth, barHeight)
      })
    })

    // 绘制图例
    const legendY = padding / 2
    let legendX = padding

    data.datasets.forEach((dataset, index) => {
      const color = dataset.backgroundColor || getColor(index)

      // 绘制图例颜色块
      ctx.fillStyle = color
      ctx.fillRect(legendX, legendY - 5, 10, 10)

      // 绘制图例文字
      ctx.fillStyle = "rgba(148, 163, 184, 0.8)"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(dataset.label, legendX + 15, legendY)

      legendX += ctx.measureText(dataset.label).width + 40
    })
  }

  // 绘制面积图
  const drawAreaChart = (ctx: CanvasRenderingContext2D, data: ChartData, width: number, height: number) => {
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // 找出数据的最大值和最小值
    const allValues = data.datasets.flatMap((dataset) => dataset.data)
    const maxValue = Math.max(...allValues)
    const minValue = Math.min(...allValues, 0)
    const range = maxValue - minValue

    // 绘制坐标轴
    ctx.strokeStyle = "rgba(100, 116, 139, 0.5)"
    ctx.lineWidth = 1

    // X轴
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Y轴
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // 绘制网格线和标签
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.font = "10px sans-serif"
    ctx.fillStyle = "rgba(148, 163, 184, 0.8)"

    // 水平网格线和Y轴标签
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      const value = maxValue - (maxValue - minValue) * (i / 5)

      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.strokeStyle = "rgba(100, 116, 139, 0.1)"
      ctx.stroke()

      ctx.fillText(value.toFixed(0), padding - 5, y)
    }

    // X轴标签
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    const step = Math.ceil(data.labels.length / 10) // 最多显示10个标签
    for (let i = 0; i < data.labels.length; i += step) {
      const x = padding + (chartWidth / (data.labels.length - 1)) * i
      ctx.fillText(data.labels[i], x, height - padding + 5)
    }

    // 绘制每个数据集
    data.datasets.forEach((dataset, datasetIndex) => {
      const color = dataset.borderColor || getColor(datasetIndex)
      const fillColor = dataset.backgroundColor || color.replace(")", ", 0.2)").replace("rgb", "rgba")

      ctx.strokeStyle = color
      ctx.fillStyle = fillColor
      ctx.lineWidth = 2
      ctx.beginPath()

      // 绘制线和填充区域
      data.labels.forEach((_, index) => {
        const x = padding + (chartWidth / (data.labels.length - 1)) * index
        const normalizedValue = (dataset.data[index] - minValue) / (range || 1)
        const y = height - padding - normalizedValue * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      // 闭合路径以填充区域
      ctx.lineTo(padding + chartWidth, height - padding)
      ctx.lineTo(padding, height - padding)
      ctx.closePath()
      ctx.fill()

      // 重新绘制线条
      ctx.beginPath()
      data.labels.forEach((_, index) => {
        const x = padding + (chartWidth / (data.labels.length - 1)) * index
        const normalizedValue = (dataset.data[index] - minValue) / (range || 1)
        const y = height - padding - normalizedValue * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // 绘制点
      ctx.fillStyle = color
      data.labels.forEach((_, index) => {
        const x = padding + (chartWidth / (data.labels.length - 1)) * index
        const normalizedValue = (dataset.data[index] - minValue) / (range || 1)
        const y = height - padding - normalizedValue * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      })
    })

    // 绘制图例
    const legendY = padding / 2
    let legendX = padding

    data.datasets.forEach((dataset, index) => {
      const color = dataset.borderColor || getColor(index)

      // 绘制图例颜色块
      ctx.fillStyle = color
      ctx.fillRect(legendX, legendY - 5, 10, 10)

      // 绘制图例文字
      ctx.fillStyle = "rgba(148, 163, 184, 0.8)"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(dataset.label, legendX + 15, legendY)

      legendX += ctx.measureText(dataset.label).width + 40
    })
  }

  // 绘制饼图
  const drawPieChart = (ctx: CanvasRenderingContext2D, data: ChartData, width: number, height: number) => {
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 40

    // 计算总和
    const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0)

    // 绘制饼图
    let startAngle = 0
    data.datasets[0].data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI
      const endAngle = startAngle + sliceAngle

      // 绘制扇形
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      // 填充颜色
      const color = Array.isArray(data.datasets[0].backgroundColor)
        ? data.datasets[0].backgroundColor[index]
        : getColor(index)
      ctx.fillStyle = color
      ctx.fill()

      // 绘制边框
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.stroke()

      // 计算标签位置
      const labelAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + Math.cos(labelAngle) * labelRadius
      const labelY = centerY + Math.sin(labelAngle) * labelRadius

      // 绘制标签
      ctx.fillStyle = "#fff"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.font = "12px sans-serif"

      // 显示百分比
      const percentage = ((value / total) * 100).toFixed(1) + "%"
      ctx.fillText(percentage, labelX, labelY)

      // 更新起始角度
      startAngle = endAngle
    })

    // 绘制图例
    const legendY = height - 30
    let legendX = centerX - (data.labels.length * 80) / 2

    data.labels.forEach((label, index) => {
      const color = Array.isArray(data.datasets[0].backgroundColor)
        ? data.datasets[0].backgroundColor[index]
        : getColor(index)

      // 绘制图例颜色块
      ctx.fillStyle = color
      ctx.fillRect(legendX, legendY, 10, 10)

      // 绘制图例文字
      ctx.fillStyle = "rgba(148, 163, 184, 0.8)"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(label, legendX + 15, legendY + 5)

      legendX += 80
    })
  }

  // 获取颜色
  const getColor = (index: number): string => {
    const colors = [
      "rgb(59, 130, 246)",
      "rgb(16, 185, 129)",
      "rgb(249, 115, 22)",
      "rgb(139, 92, 246)",
      "rgb(236, 72, 153)",
      "rgb(234, 179, 8)",
    ]
    return colors[index % colors.length]
  }

  // 下载图表
  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // 创建下载链接
    const link = document.createElement("a")
    link.download = `${title.replace(/\s+/g, "-")}-chart-${Date.now()}.png`
    link.href = canvas.toDataURL("image/png")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "下载成功",
      description: "图表已下载为PNG图片",
    })
  }

  // 放大图表
  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.2, 2))
  }

  // 缩小图表
  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.2, 0.5))
  }

  return (
    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">{title}</CardTitle>
            {description && <CardDescription className="text-slate-400">{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-1">
            {allowZoom && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 2}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </>
            )}
            {onRefresh && (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            )}
            {allowDownload && (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {allowTypeChange && (
          <Tabs value={chartType} onValueChange={(value) => setChartType(value as ChartType)} className="mt-2">
            <TabsList className="bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="line" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                线图
              </TabsTrigger>
              <TabsTrigger value="bar" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                柱状图
              </TabsTrigger>
              <TabsTrigger value="area" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                面积图
              </TabsTrigger>
              <TabsTrigger value="pie" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                饼图
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative w-full overflow-auto" style={{ height: height * zoomLevel }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  )
}
