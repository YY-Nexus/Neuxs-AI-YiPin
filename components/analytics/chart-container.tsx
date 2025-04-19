"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, ZoomIn, ZoomOut } from "lucide-react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface ChartContainerProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  allowDownload?: boolean
  allowZoom?: boolean
  onRefresh?: () => void
  isLoading?: boolean
  downloadFileName?: string
  headerRight?: React.ReactNode
}

export function ChartContainer({
  title,
  description,
  children,
  className,
  allowDownload = true,
  allowZoom = true,
  onRefresh,
  isLoading = false,
  downloadFileName,
  headerRight,
}: ChartContainerProps) {
  const [zoomLevel, setZoomLevel] = useState(1)

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }, [])

  const handleDownload = useCallback(() => {
    // 这里可以实现下载逻辑
    console.log("Downloading chart:", downloadFileName || title)
  }, [downloadFileName, title])

  return (
    <Card className={cn("bg-slate-900/60 border-slate-800 backdrop-blur-sm", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">{title}</CardTitle>
            {description && <CardDescription className="text-slate-400">{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-1">
            {headerRight}

            {allowZoom && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.5}
                  aria-label="缩小"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 2}
                  aria-label="放大"
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
                aria-label="刷新"
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
                aria-label="下载"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div
          className="relative w-full overflow-auto transition-all duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top left", height: `${zoomLevel * 100}%` }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
