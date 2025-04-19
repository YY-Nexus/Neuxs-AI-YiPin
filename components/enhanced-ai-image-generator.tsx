"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Download,
  Copy,
  Link,
  Save,
  History,
  Maximize2,
  Minimize2,
  ImageIcon,
  Wand2,
  Trash2,
  RefreshCw,
  X,
  Edit,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react"

// 图片风格类型
type ImageStyle = {
  id: string
  name: string
  description: string
  preview: string
  params?: Record<string, any>
}

// 图片比例类型
type AspectRatio = {
  id: string
  name: string
  ratio: number
}

// 图片历史记录类型
type ImageHistory = {
  id: string
  prompt: string
  imageUrl: string
  style: string
  timestamp: Date
  params: Record<string, any>
}

// 增强的图片风格列表
const enhancedImageStyles: ImageStyle[] = [
  {
    id: "realistic",
    name: "写实风格",
    description: "高度逼真的照片级效果",
    preview: "/placeholder.svg?height=80&width=80&text=写实风格",
    params: {
      realism: 0.9,
      detailLevel: 0.8,
    },
  },
  {
    id: "cartoon",
    name: "卡通风格",
    description: "生动活泼的卡通插图",
    preview: "/placeholder.svg?height=80&width=80&text=卡通风格",
    params: {
      stylization: 0.7,
      colorfulness: 0.8,
    },
  },
  {
    id: "watercolor",
    name: "水彩风格",
    description: "柔和的水彩艺术效果",
    preview: "/placeholder.svg?height=80&width=80&text=水彩风格",
    params: {
      softness: 0.8,
      blending: 0.7,
    },
  },
  {
    id: "3d",
    name: "3D渲染",
    description: "立体感强的三维渲染",
    preview: "/placeholder.svg?height=80&width=80&text=3D渲染",
    params: {
      depth: 0.9,
      lighting: 0.8,
    },
  },
  {
    id: "minimalist",
    name: "极简风格",
    description: "简洁干净的设计风格",
    preview: "/placeholder.svg?height=80&width=80&text=极简风格",
    params: {
      simplicity: 0.9,
      contrast: 0.6,
    },
  },
  {
    id: "ecommerce",
    name: "电商产品",
    description: "专业的产品展示效果",
    preview: "/placeholder.svg?height=80&width=80&text=电商产品",
    params: {
      clarity: 0.9,
      lighting: 0.8,
    },
  },
  {
    id: "oil-painting",
    name: "油画风格",
    description: "经典油画艺术效果",
    preview: "/placeholder.svg?height=80&width=80&text=油画风格",
    params: {
      brushStrokes: 0.8,
      texture: 0.7,
    },
  },
  {
    id: "pixel-art",
    name: "像素艺术",
    description: "复古像素游戏风格",
    preview: "/placeholder.svg?height=80&width=80&text=像素艺术",
    params: {
      pixelation: 0.9,
      colorReduction: 0.7,
    },
  },
  {
    id: "anime",
    name: "动漫风格",
    description: "日式动漫插画风格",
    preview: "/placeholder.svg?height=80&width=80&text=动漫风格",
    params: {
      linework: 0.8,
      colorfulness: 0.7,
    },
  },
  {
    id: "cyberpunk",
    name: "赛博朋克",
    description: "未来科技风格",
    preview: "/placeholder.svg?height=80&width=80&text=赛博朋克",
    params: {
      neon: 0.9,
      contrast: 0.8,
    },
  },
  {
    id: "fantasy",
    name: "奇幻风格",
    description: "魔幻奇幻世界风格",
    preview: "/placeholder.svg?height=80&width=80&text=奇幻风格",
    params: {
      atmosphere: 0.8,
      lighting: 0.7,
    },
  },
  {
    id: "retro",
    name: "复古风格",
    description: "怀旧复古艺术效果",
    preview: "/placeholder.svg?height=80&width=80&text=复古风格",
    params: {
      grain: 0.7,
      fading: 0.6,
    },
  },
]

// 图片比例选项
const aspectRatios: AspectRatio[] = [
  { id: "1:1", name: "正方形 1:1", ratio: 1 },
  { id: "4:3", name: "标准 4:3", ratio: 4 / 3 },
  { id: "3:4", name: "竖向 3:4", ratio: 3 / 4 },
  { id: "16:9", name: "宽屏 16:9", ratio: 16 / 9 },
  { id: "9:16", name: "移动端 9:16", ratio: 9 / 16 },
  { id: "3:2", name: "照片 3:2", ratio: 3 / 2 },
  { id: "2:3", name: "竖向照片 2:3", ratio: 2 / 3 },
  { id: "21:9", name: "超宽屏 21:9", ratio: 21 / 9 },
]

interface EnhancedAIImageGeneratorProps {
  onImageGenerated?: (imageUrl: string) => void
  initialPrompt?: string
}

export function EnhancedAIImageGenerator({ onImageGenerated, initialPrompt = "" }: EnhancedAIImageGeneratorProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [negativePrompt, setNegativePrompt] = useState("")
  const [selectedStyle, setSelectedStyle] = useState<string>("realistic")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState<[number]>([512])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [isCopyingUrl, setIsCopyingUrl] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>("1:1")
  const [advancedMode, setAdvancedMode] = useState(false)
  const [imageHistory, setImageHistory] = useState<ImageHistory[]>([])
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [styleParams, setStyleParams] = useState<Record<string, number>>({})
  const [styleStrength, setStyleStrength] = useState<[number]>([70])
  const [promptStrength, setPromptStrength] = useState<[number]>([70])
  const [seed, setSeed] = useState<string>("")
  const [useSeed, setUseSeed] = useState(false)
  const { toast } = useToast()
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 初始化风格参数
  useEffect(() => {
    const style = enhancedImageStyles.find((s) => s.id === selectedStyle)
    if (style && style.params) {
      setStyleParams(style.params)
    }
  }, [selectedStyle])

  // 生成提示词建议
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
      `精致的${prompt}细节`,
      `${prompt}的创意构图`,
      `${prompt}与环境的互动`,
      `${prompt}的质感展示`,
    ]

    setSuggestions(baseSuggestions)
  }

  // 生成图片
  const handleGenerate = () => {
    if (!prompt) return

    setIsGenerating(true)
    setGeneratedImage(null)

    // 模拟图片生成过程
    setTimeout(() => {
      // 根据不同风格生成不同的占位图
      const style = enhancedImageStyles.find((s) => s.id === selectedStyle)
      const styleParam = style ? `&text=${encodeURIComponent(style.name)}` : ""

      // 获取选中的宽高比
      const aspectRatio = aspectRatios.find((ar) => ar.id === selectedAspectRatio)
      let width = imageSize[0]
      let height = imageSize[0]

      if (aspectRatio && aspectRatio.ratio !== 1) {
        if (aspectRatio.ratio > 1) {
          height = Math.round(width / aspectRatio.ratio)
        } else {
          height = width
          width = Math.round(height * aspectRatio.ratio)
        }
      }

      // 使用占位图模拟生成的图片
      const imageUrl = `/placeholder.svg?height=${height}&width=${width}${styleParam}`

      // 添加到历史记录
      const newHistoryItem: ImageHistory = {
        id: Date.now().toString(),
        prompt,
        imageUrl,
        style: selectedStyle,
        timestamp: new Date(),
        params: {
          ...styleParams,
          styleStrength: styleStrength[0],
          promptStrength: promptStrength[0],
          negativePrompt,
          seed: useSeed ? seed : "random",
          width,
          height,
        },
      }

      setImageHistory((prev) => [newHistoryItem, ...prev])
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

  // 应用提示词建议
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

  // 保存图片到收藏夹
  const handleSaveImage = () => {
    if (!generatedImage) return

    setIsSaving(true)

    // 模拟保存操作
    setTimeout(() => {
      toast({
        title: "保存成功",
        description: "图片已保存到您的收藏夹",
      })
      setIsSaving(false)
    }, 1000)
  }

  // 从历史记录中恢复图片
  const restoreFromHistory = (item: ImageHistory) => {
    setPrompt(item.prompt)
    setSelectedStyle(item.style)
    setGeneratedImage(item.imageUrl)

    // 恢复参数
    if (item.params) {
      if (item.params.styleStrength !== undefined) {
        setStyleStrength([item.params.styleStrength])
      }
      if (item.params.promptStrength !== undefined) {
        setPromptStrength([item.params.promptStrength])
      }
      if (item.params.negativePrompt !== undefined) {
        setNegativePrompt(item.params.negativePrompt)
      }
      if (item.params.seed !== undefined && item.params.seed !== "random") {
        setSeed(item.params.seed)
        setUseSeed(true)
      } else {
        setUseSeed(false)
      }

      // 恢复风格参数
      const styleParamsToRestore: Record<string, number> = {}
      Object.entries(item.params).forEach(([key, value]) => {
        if (
          key !== "styleStrength" &&
          key !== "promptStrength" &&
          key !== "negativePrompt" &&
          key !== "seed" &&
          key !== "width" &&
          key !== "height" &&
          typeof value === "number"
        ) {
          styleParamsToRestore[key] = value
        }
      })

      if (Object.keys(styleParamsToRestore).length > 0) {
        setStyleParams(styleParamsToRestore)
      }
    }

    setHistoryDialogOpen(false)

    toast({
      title: "已恢复",
      description: "已从历史记录恢复图片设置",
    })
  }

  // 删除历史记录
  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setImageHistory((prev) => prev.filter((item) => item.id !== id))

    toast({
      title: "已删除",
      description: "已从历史记录中删除该图片",
    })
  }

  // 清空历史记录
  const clearHistory = () => {
    setImageHistory([])

    toast({
      title: "已清空",
      description: "已清空所有历史记录",
    })
  }

  // 生成随机种子
  const generateRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * 1000000000).toString()
    setSeed(randomSeed)
  }

  // 更新风格参数
  const updateStyleParams = (paramName: string, value: number) => {
    setStyleParams((prevParams) => ({ ...prevParams, [paramName]: value }))
  }

  // 渲染风格选择器
  const renderStyleSelector = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
        {enhancedImageStyles.map((style) => (
          <div
            key={style.id}
            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${
              selectedStyle === style.id ? "ring-2 ring-primary ring-offset-2" : "ring-1 ring-border"
            }`}
            onClick={() => setSelectedStyle(style.id)}
          >
            <img
              src={style.preview || "/placeholder.svg"}
              alt={style.name}
              className="w-full aspect-square object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-1.5 text-xs font-medium text-center">
              {style.name}
            </div>
            {selectedStyle === style.id && (
              <div className="absolute top-2 right-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // 渲染比例选择器
  const renderAspectRatioSelector = () => {
    return (
      <RadioGroup
        value={selectedAspectRatio}
        onValueChange={setSelectedAspectRatio}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4"
      >
        {aspectRatios.map((ratio) => (
          <div key={ratio.id}>
            <RadioGroupItem value={ratio.id} id={`ratio-${ratio.id}`} className="peer sr-only" />
            <Label
              htmlFor={`ratio-${ratio.id}`}
              className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <div
                className="w-16 h-12 bg-muted-foreground/20 rounded-sm mb-1"
                style={{
                  aspectRatio: ratio.ratio.toString(),
                  maxWidth: ratio.ratio >= 1 ? "4rem" : `${4 * ratio.ratio}rem`,
                  maxHeight: ratio.ratio <= 1 ? "3rem" : `${3 / ratio.ratio}rem`,
                }}
              />
              <span className="text-xs">{ratio.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    )
  }

  // 渲染高级设置
  const renderAdvancedSettings = () => {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="negative-prompt">
          <AccordionTrigger>负面提示词</AccordionTrigger>
          <AccordionContent>
            <Textarea
              placeholder="输入不希望在图片中出现的元素，如：模糊, 变形, 低质量"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="min-h-[80px]"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="style-strength">
          <AccordionTrigger>风格强度</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">弱</span>
                <span className="text-sm font-medium">{styleStrength[0]}%</span>
                <span className="text-sm">强</span>
              </div>
              <Slider value={styleStrength} onValueChange={setStyleStrength} min={0} max={100} step={1} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="prompt-strength">
          <AccordionTrigger>提示词强度</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">弱</span>
                <span className="text-sm font-medium">{promptStrength[0]}%</span>
                <span className="text-sm">强</span>
              </div>
              <Slider value={promptStrength} onValueChange={setPromptStrength} min={0} max={100} step={1} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="image-size">
          <AccordionTrigger>图片尺寸</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">小</span>
                <span className="text-sm font-medium">{imageSize[0]}px</span>
                <span className="text-sm">大</span>
              </div>
              <Slider value={imageSize} onValueChange={setImageSize} min={256} max={1024} step={64} />
              <p className="text-xs text-muted-foreground mt-1">较大的尺寸可能需要更长的生成时间</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="seed">
          <AccordionTrigger>随机种子</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch id="use-seed" checked={useSeed} onCheckedChange={setUseSeed} />
                <Label htmlFor="use-seed">使用固定种子</Label>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder="输入种子数值"
                  disabled={!useSeed}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button variant="outline" size="sm" onClick={generateRandomSeed} disabled={!useSeed}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  随机
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">使用相同的种子可以在其他参数不变的情况下生成相似的图片</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="style-params">
          <AccordionTrigger>风格参数调整</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {Object.entries(styleParams).map(([param, value]) => (
                <div key={param} className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor={`param-${param}`} className="capitalize">
                      {param.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </Label>
                    <span className="text-sm font-medium">{Math.round(value * 100)}%</span>
                  </div>
                  <Slider
                    id={`param-${param}`}
                    value={[value * 100]}
                    onValueChange={(newValue) => updateStyleParams(param, newValue[0] / 100)}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }

  // 渲染历史记录对话框
  const renderHistoryDialog = () => {
    return (
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={() => setHistoryDialogOpen(true)}>
            <History className="h-4 w-4 mr-2" />
            历史记录
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>生成历史记录</span>
              <Button variant="outline" size="sm" onClick={clearHistory} disabled={imageHistory.length === 0}>
                <Trash2 className="h-4 w-4 mr-1" />
                清空
              </Button>
            </DialogTitle>
          </DialogHeader>

          {imageHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">暂无历史记录</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {imageHistory.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => restoreFromHistory(item)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.prompt}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={(e) => deleteHistoryItem(item.id, e)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm line-clamp-2">{item.prompt}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline">
                        {enhancedImageStyles.find((s) => s.id === item.style)?.name || item.style}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  // 渲染编辑对话框
  const renderEditDialog = () => {
    return (
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)} disabled={!generatedImage}>
            <Edit className="h-4 w-4 mr-2" />
            编辑
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>编辑图片</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">此功能将在未来版本中提供，敬请期待！</p>

            {generatedImage && (
              <div className="flex justify-center">
                <img
                  src={generatedImage || "/placeholder.svg"}
                  alt="待编辑图片"
                  className="max-h-[300px] object-contain rounded-md"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          增强型 AI 图像生成器
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">生成</TabsTrigger>
            <TabsTrigger value="settings">设置</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="prompt" className="text-base font-medium">
                图片描述
              </Label>
              <Textarea
                id="prompt"
                placeholder="描述您想要生成的图片，例如：一只可爱的橙色猫咪在阳光下玩耍"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onBlur={generateSuggestions}
                className="min-h-[100px] mt-2"
              />

              {suggestions.length > 0 && (
                <div className="mt-2">
                  <Label className="text-sm">提示词建议</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {suggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => handleApplySuggestion(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">图片风格</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setSelectedStyle("realistic")}
                >
                  重置
                </Button>
              </div>
              {renderStyleSelector()}
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center space-x-2">
                <Switch id="advanced-mode" checked={advancedMode} onCheckedChange={setAdvancedMode} />
                <Label htmlFor="advanced-mode">高级模式</Label>
              </div>

              <Button onClick={handleGenerate} disabled={!prompt || isGenerating} className="min-w-[120px]">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    生成中
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    生成图片
                  </>
                )}
              </Button>
            </div>

            {advancedMode && (
              <div className="pt-2">
                <div>
                  <Label className="text-base font-medium">图片比例</Label>
                  {renderAspectRatioSelector()}
                </div>

                <div className="mt-4">
                  <Label className="text-base font-medium">高级设置</Label>
                  <div className="mt-2">{renderAdvancedSettings()}</div>
                </div>
              </div>
            )}

            {generatedImage && (
              <div
                className={`mt-6 ${isFullscreen ? "fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-8" : ""}`}
              >
                <div className="relative">
                  <img
                    ref={imageRef}
                    src={generatedImage || "/placeholder.svg"}
                    alt="AI 生成的图片"
                    className={`rounded-lg mx-auto ${isFullscreen ? "max-h-[90vh] max-w-full object-contain" : "max-h-[400px]"}`}
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading}>
                          {isDownloading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          下载
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>下载图片到本地</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleCopyImage} disabled={isCopying}>
                          {isCopying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4 mr-1" />}
                          复制
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>复制图片到剪贴板</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleCopyImageUrl} disabled={isCopyingUrl}>
                          {isCopyingUrl ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Link className="h-4 w-4 mr-1" />
                          )}
                          复制链接
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>复制图片URL</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleSaveImage} disabled={isSaving}>
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                          收藏
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>保存到收藏夹</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {renderEditDialog()}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <div>
              <h3 className="text-base font-medium mb-2">图片生成设置</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-style">默认风格</Label>
                    <select
                      id="default-style"
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {enhancedImageStyles.map((style) => (
                        <option key={style.id} value={style.id}>
                          {style.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-ratio">默认比例</Label>
                    <select
                      id="default-ratio"
                      value={selectedAspectRatio}
                      onChange={(e) => setSelectedAspectRatio(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {aspectRatios.map((ratio) => (
                        <option key={ratio.id} value={ratio.id}>
                          {ratio.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="default-size">默认图片尺寸</Label>
                    <span className="text-sm">{imageSize[0]}px</span>
                  </div>
                  <Slider
                    id="default-size"
                    value={imageSize}
                    onValueChange={setImageSize}
                    min={256}
                    max={1024}
                    step={64}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">历史记录</h3>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">已保存 {imageHistory.length} 条生成记录</p>
                {renderHistoryDialog()}
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">关于</h3>
              <p className="text-sm text-muted-foreground">
                增强型 AI 图像生成器 v1.0.0
                <br />
                支持多种风格、高级参数调整和历史记录管理
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="ghost" size="sm" asChild>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <ImageIcon className="h-4 w-4 mr-1" />
            查看教程
          </a>
        </Button>

        <div className="flex items-center text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3 mr-1" />
          生成的图片仅供参考
        </div>
      </CardFooter>

      <canvas ref={canvasRef} className="hidden" />
    </Card>
  )
}
