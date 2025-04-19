"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Sparkles, RefreshCw, Download, Copy, ImageIcon, Wand2, Lightbulb, Check, Link2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

type ImageStyle = {
  id: string
  name: string
  description: string
  preview: string
}

const imageStyles: ImageStyle[] = [
  {
    id: "realistic",
    name: "写实风格",
    description: "高度逼真的照片级效果",
    preview: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "cartoon",
    name: "卡通风格",
    description: "生动活泼的卡通插图",
    preview: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "watercolor",
    name: "水彩风格",
    description: "柔和的水彩艺术效果",
    preview: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "3d",
    name: "3D渲染",
    description: "立体感强的三维渲染",
    preview: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "minimalist",
    name: "极简风格",
    description: "简洁干净的设计风格",
    preview: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "ecommerce",
    name: "电商产品",
    description: "专业的产品展示效果",
    preview: "/placeholder.svg?height=80&width=80",
  },
]

interface AIImageGeneratorProps {
  onImageGenerated?: (imageUrl: string) => void
  initialPrompt?: string
}

export function AIImageGenerator({ onImageGenerated, initialPrompt = "" }: AIImageGeneratorProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [selectedStyle, setSelectedStyle] = useState<string>("realistic")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState<[number]>([512])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [isCopyingUrl, setIsCopyingUrl] = useState(false)
  const { toast } = useToast()
  const imageRef = useRef<HTMLImageElement>(null)

  const generateSuggestions = () => {
    if (!prompt || prompt.length < 3) return

    // 模拟生成提示词建议
    const baseSuggestions = [
      `高品质${prompt}特写`,
      `${prompt}在自然光下的展示`,
      `${prompt}与模特展示`,
      `${prompt}的细节特写`,
      `${prompt}的多角度展示`,
      `${prompt}在实际使用场景中`,
    ]

    setSuggestions(baseSuggestions)
  }

  const handleGenerate = () => {
    if (!prompt) return

    setIsGenerating(true)
    setGeneratedImage(null)

    // 模拟图片生成过程
    setTimeout(() => {
      // 根据不同风格生成不同的占位图
      const style = imageStyles.find((s) => s.id === selectedStyle)
      const styleParam = style ? `&text=${encodeURIComponent(style.name)}` : ""

      // 使用占位图模拟生成的图片
      const imageUrl = `/placeholder.svg?height=${imageSize[0]}&width=${imageSize[0]}${styleParam}`

      setGeneratedImage(imageUrl)
      setIsGenerating(false)

      toast({
        title: "图片生成成功",
        description: `已生成 ${style?.name || "自定义"} 风格的图片`,
      })

      if (onImageGenerated) {
        onImageGenerated(imageUrl)
      }
    }, 2000)
  }

  const handleApplySuggestion = (suggestion: string) => {
    setPrompt(suggestion)
  }

  // 下载生成的图片
  const handleDownload = async () => {
    if (!generatedImage) return

    setIsDownloading(true)

    try {
      // 创建一个临时链接
      const link = document.createElement("a")
      link.href = generatedImage
      link.download = `ai-generated-image-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "下载成功",
        description: "图片已成功下载到您的设备",
      })
    } catch (error) {
      toast({
        title: "下载失败",
        description: "无法下载图片，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setIsDownloading(false)
      }, 1000)
    }
  }

  // 复制图片到剪贴板
  const handleCopyImage = async () => {
    if (!generatedImage || !imageRef.current) return

    setIsCopying(true)

    try {
      // 创建一个canvas元素
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("无法创建canvas上下文")

      // 设置canvas大小
      canvas.width = imageRef.current.naturalWidth
      canvas.height = imageRef.current.naturalHeight

      // 在canvas上绘制图片
      ctx.drawImage(imageRef.current, 0, 0)

      // 将canvas转换为blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else throw new Error("无法创建图片blob")
        }, "image/png")
      })

      // 复制到剪贴板
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ])

      toast({
        title: "复制成功",
        description: "图片已复制到剪贴板",
      })
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制图片，请稍后再试或使用下载功能",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setIsCopying(false)
      }, 1000)
    }
  }

  // 复制图片URL到剪贴板
  const handleCopyImageUrl = async () => {
    if (!generatedImage) return

    setIsCopyingUrl(true)

    try {
      // 获取完整URL
      const fullUrl = new URL(generatedImage, window.location.origin).href

      // 复制到剪贴板
      await navigator.clipboard.writeText(fullUrl)

      toast({
        title: "复制成功",
        description: "图片URL已复制到剪贴板",
      })
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制图片URL，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setIsCopyingUrl(false)
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">AI 图片生成</h2>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
            onClick={() => setGeneratedImage(null)}
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            新图片
          </Button>
        </div>

        <Tabs defaultValue="prompt" className="w-full">
          <TabsList className="grid grid-cols-2 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="prompt" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              提示词
            </TabsTrigger>
            <TabsTrigger value="style" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              风格选择
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompt" className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">图片描述</label>
              <Textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value)
                  if (e.target.value.length > 3) {
                    generateSuggestions()
                  } else {
                    setSuggestions([])
                  }
                }}
                placeholder="描述您想要生成的图片内容，例如：真丝连衣裙产品展示，高级感，简约背景"
                className="min-h-[100px] border-slate-700 bg-slate-800/50 text-slate-200 resize-none"
              />
            </div>

            {suggestions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  <Lightbulb className="h-4 w-4 inline-block mr-1 text-yellow-500" />
                  提示词建议
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                      onClick={() => handleApplySuggestion(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-400">图片尺寸</label>
                <span className="text-sm text-slate-400">
                  {imageSize[0]} x {imageSize[0]} px
                </span>
              </div>
              <Slider
                value={imageSize}
                onValueChange={setImageSize}
                min={256}
                max={1024}
                step={128}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-blue-600"
              />
              <div className="flex justify-between mt-1 text-xs text-slate-500">
                <span>256px</span>
                <span>512px</span>
                <span>1024px</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="style" className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {imageStyles.map((style) => (
                <div
                  key={style.id}
                  className={cn(
                    "border rounded-lg p-2 cursor-pointer transition-all",
                    selectedStyle === style.id
                      ? "border-blue-600 bg-blue-900/20"
                      : "border-slate-700 bg-slate-800/50 hover:bg-slate-800/70",
                  )}
                  onClick={() => setSelectedStyle(style.id)}
                >
                  <div className="aspect-square rounded-md overflow-hidden mb-2 bg-slate-700">
                    <img
                      src={style.preview || "/placeholder.svg"}
                      alt={style.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-white">{style.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{style.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-slate-800/30 rounded-lg border border-slate-700 mb-4">
          {isGenerating ? (
            <div className="text-center">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-blue-500" />
              <p className="text-slate-400">生成图片中...</p>
            </div>
          ) : generatedImage ? (
            <img
              ref={imageRef}
              src={generatedImage || "/placeholder.svg"}
              alt="Generated image"
              className="max-w-full max-h-full object-contain"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="text-center p-6">
              <Wand2 className="h-12 w-12 mx-auto mb-3 text-slate-600" />
              <p className="text-slate-400 mb-2">输入提示词并点击生成按钮</p>
              <p className="text-xs text-slate-500">AI 将根据您的描述生成图片</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleGenerate}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white gap-2"
            disabled={!prompt || isGenerating}
          >
            {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isGenerating ? "生成中..." : "生成图片"}
          </Button>

          {generatedImage && (
            <>
              <Button
                variant="outline"
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 gap-2"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                {isDownloading ? "已下载" : "下载"}
              </Button>
              <Button
                variant="outline"
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 gap-2"
                onClick={handleCopyImage}
                disabled={isCopying}
              >
                {isCopying ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {isCopying ? "已复制" : "复制"}
              </Button>
              <Button
                variant="outline"
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 gap-2"
                onClick={handleCopyImageUrl}
                disabled={isCopyingUrl}
              >
                {isCopyingUrl ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                复制URL
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
