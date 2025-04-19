"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Sparkles, RefreshCw, Copy, BarChart2, ArrowRight, Plus, Trash2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"

type TestVariant = {
  id: string
  name: string
  content: string
  metrics: {
    views: number
    clicks: number
    conversions: number
  }
}

export function ABTesting() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [variants, setVariants] = useState<TestVariant[]>([
    {
      id: "1",
      name: "版本 A（情感诉求）",
      content:
        "这款真丝连衣裙让您在任何场合都成为焦点，柔滑面料轻抚肌肤，几何剪裁勾勒完美曲线，展现您的优雅气质。限时优惠，原价¥599，现在购买仅需¥399！",
      metrics: {
        views: 1245,
        clicks: 187,
        conversions: 32,
      },
    },
    {
      id: "2",
      name: "版本 B（功能诉求）",
      content:
        "高级真丝面料，透气舒适，不易皱褶。独特几何剪裁，修身显瘦，适合多种场合。多色可选，XS-XL全尺码。限时优惠¥399，原价¥599，节省¥200！",
      metrics: {
        views: 1258,
        clicks: 163,
        conversions: 28,
      },
    },
  ])

  const [activeVariantId, setActiveVariantId] = useState<string>("1")
  const [expandedMetrics, setExpandedMetrics] = useState(true)
  const [isCopying, setIsCopying] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [copiedVariantId, setCopiedVariantId] = useState<string | null>(null)
  const { toast } = useToast()
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const addVariant = () => {
    const newVariant: TestVariant = {
      id: Date.now().toString(),
      name: `版本 ${String.fromCharCode(65 + variants.length)}`,
      content: "",
      metrics: {
        views: 0,
        clicks: 0,
        conversions: 0,
      },
    }

    setVariants([...variants, newVariant])
    setActiveVariantId(newVariant.id)
  }

  const updateVariant = (id: string, updates: Partial<TestVariant>) => {
    setVariants(variants.map((variant) => (variant.id === id ? { ...variant, ...updates } : variant)))
  }

  const deleteVariant = (id: string) => {
    if (variants.length <= 1) return

    setVariants(variants.filter((variant) => variant.id !== id))
    if (activeVariantId === id) {
      setActiveVariantId(variants[0].id === id ? variants[1].id : variants[0].id)
    }
  }

  const generateVariant = (id: string) => {
    setIsGenerating(true)

    // 模拟生成过程
    setTimeout(() => {
      const baseContent =
        "这款新品连衣裙采用高级真丝面料，触感柔滑，穿着舒适。独特的几何剪裁设计，勾勒出完美曲线，尽显优雅气质。"
      const variant = variants.find((v) => v.id === id)

      if (variant) {
        let newContent = ""

        if (variant.name.includes("情感")) {
          newContent = `${baseContent}穿上它，让您在任何场合都成为焦点，散发自信魅力。限时优惠，原价¥599，现在购买仅需¥399！心动不如行动，为自己的衣橱增添一抹高级感！`
        } else if (variant.name.includes("功能")) {
          newContent = `${baseContent}面料透气不易皱，适合商务、约会等多种场合。多色可选，XS-XL全尺码。限时优惠¥399，原价¥599，节省¥200！购买即送精美包装和护理说明书。`
        } else {
          newContent = `${baseContent}多种场合百搭，从商务会议到晚宴约会，都能轻松驾驭。限时优惠，原价¥599，现在购买仅需¥399！更有多色可选，赶紧下单，穿出专属于你的时尚态度！`
        }

        updateVariant(id, { content: newContent })
      }

      setIsGenerating(false)
      toast({
        title: "变体生成成功",
        description: "AI已为您生成新的变体内容",
      })
    }, 1500)
  }

  const calculateRate = (numerator: number, denominator: number): string => {
    if (denominator === 0) return "0.00%"
    return ((numerator / denominator) * 100).toFixed(2) + "%"
  }

  const getBestVariant = (): string | null => {
    if (variants.length === 0) return null

    const sorted = [...variants].sort((a, b) => {
      const aRate = a.metrics.conversions / a.metrics.views || 0
      const bRate = b.metrics.conversions / b.metrics.views || 0
      return bRate - aRate
    })

    return sorted[0].id
  }

  // 复制变体内容
  const handleCopyVariant = (id: string) => {
    const variant = variants.find((v) => v.id === id)
    if (!variant) return

    setIsCopying(true)
    setCopiedVariantId(id)

    // 复制到剪贴板
    navigator.clipboard
      .writeText(variant.content)
      .then(() => {
        toast({
          title: "复制成功",
          description: `已复制 "${variant.name}" 的内容到剪贴板`,
        })
      })
      .catch(() => {
        toast({
          title: "复制失败",
          description: "无法复制内容，请稍后再试",
          variant: "destructive",
        })
      })
      .finally(() => {
        setTimeout(() => {
          setIsCopying(false)
          setCopiedVariantId(null)
        }, 1500)
      })
  }

  // 应用变体内容（模拟将内容应用到主编辑器）
  const handleApplyVariant = (id: string) => {
    const variant = variants.find((v) => v.id === id)
    if (!variant) return

    setIsApplying(true)

    // 模拟应用过程
    setTimeout(() => {
      // 在实际应用中，这里应该将内容应用到主编辑器
      // 例如通过全局状态管理或事件系统
      toast({
        title: "应用成功",
        description: `已应用 "${variant.name}" 的内容到主编辑器`,
      })
      setIsApplying(false)

      // 将内容存储到localStorage，以便主编辑器可以获取
      localStorage.setItem("applied-ab-content", variant.content)
      localStorage.setItem("applied-ab-timestamp", Date.now().toString())

      // 触发自定义事件，通知其他组件
      const event = new CustomEvent("ab-content-applied", {
        detail: { content: variant.content, variantName: variant.name },
      })
      window.dispatchEvent(event)
    }, 1000)
  }

  const bestVariantId = getBestVariant()
  const activeVariant = variants.find((v) => v.id === activeVariantId)

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">A/B 测试</h2>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
            onClick={addVariant}
          >
            <Plus className="h-4 w-4 mr-1" />
            添加变体
          </Button>
        </div>

        <Tabs value={activeVariantId} onValueChange={setActiveVariantId} className="w-full">
          <TabsList className="bg-slate-800/50 border border-slate-700 w-full flex">
            {variants.map((variant) => (
              <TabsTrigger
                key={variant.id}
                value={variant.id}
                className={cn(
                  "flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                  bestVariantId === variant.id && "data-[state=active]:bg-green-600",
                )}
              >
                {variant.name}
                {bestVariantId === variant.id && <Check className="h-3 w-3 ml-1" />}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeVariant && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Input
                  value={activeVariant.name}
                  onChange={(e) => updateVariant(activeVariant.id, { name: e.target.value })}
                  className="h-8 border-slate-700 bg-slate-800/50 text-slate-200 text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-white"
                  onClick={() => deleteVariant(activeVariant.id)}
                  disabled={variants.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={() => generateVariant(activeVariant.id)}
                className="h-8 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white gap-2"
                disabled={isGenerating}
              >
                {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {isGenerating ? "生成中..." : "AI 生成变体"}
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">变体内容</label>
              <Textarea
                ref={textAreaRef}
                value={activeVariant.content}
                onChange={(e) =>
                  updateVariant(activeVariant.id, {
                    content: e.target.value,
                  })
                }
                className="min-h-[150px] border-slate-700 bg-slate-800/50 text-slate-200 resize-none"
                placeholder="输入或生成变体内容..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 gap-2"
                onClick={() => handleCopyVariant(activeVariant.id)}
                disabled={isCopying || !activeVariant.content}
              >
                {isCopying && copiedVariantId === activeVariant.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {isCopying && copiedVariantId === activeVariant.id ? "已复制" : "复制"}
              </Button>
              <Button
                variant="outline"
                className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 gap-2"
                onClick={() => handleApplyVariant(activeVariant.id)}
                disabled={isApplying || !activeVariant.content}
              >
                {isApplying ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {isApplying ? "应用中..." : "应用"}
              </Button>
            </div>

            <Accordion
              type="single"
              collapsible
              value={expandedMetrics ? "metrics" : ""}
              onValueChange={(value) => setExpandedMetrics(value === "metrics")}
              className="border border-slate-800 rounded-lg overflow-hidden"
            >
              <AccordionItem value="metrics" className="border-b-0">
                <AccordionTrigger className="px-4 py-3 bg-slate-800/70 hover:bg-slate-800/90 text-white">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-blue-400" />
                    <span>性能指标</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-slate-900/30 p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">浏览量</div>
                        <div className="text-lg font-medium text-white">{activeVariant.metrics.views}</div>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">点击量</div>
                        <div className="text-lg font-medium text-white">{activeVariant.metrics.clicks}</div>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">转化量</div>
                        <div className="text-lg font-medium text-white">{activeVariant.metrics.conversions}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">点击率 (CTR)</div>
                        <div className="text-lg font-medium text-white">
                          {calculateRate(activeVariant.metrics.clicks, activeVariant.metrics.views)}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">转化率 (CVR)</div>
                        <div className="text-lg font-medium text-white">
                          {calculateRate(activeVariant.metrics.conversions, activeVariant.metrics.clicks)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <h4 className="text-sm font-medium text-white mb-2">模拟测试</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                          onClick={() => {
                            const updatedMetrics = {
                              ...activeVariant.metrics,
                              views: activeVariant.metrics.views + 100,
                              clicks: activeVariant.metrics.clicks + Math.floor(Math.random() * 20) + 10,
                              conversions: activeVariant.metrics.conversions + Math.floor(Math.random() * 5) + 1,
                            }
                            updateVariant(activeVariant.id, { metrics: updatedMetrics })
                          }}
                        >
                          模拟流量
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                          onClick={() => {
                            variants.forEach((variant) => {
                              updateVariant(variant.id, {
                                metrics: {
                                  views: 0,
                                  clicks: 0,
                                  conversions: 0,
                                },
                              })
                            })
                          }}
                        >
                          重置数据
                        </Button>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
    </div>
  )
}
