"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { ContentQualityScore } from "@/components/content-quality-score"
import { ButtonFeedback } from "@/components/button-feedback"
import { useToast } from "@/components/ui/use-toast"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { Copy, Download, RefreshCw, Save, Share2, Sparkles, CheckCircle, Loader2 } from "lucide-react"

export function ContentEditor() {
  const [content, setContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [qualityScore, setQualityScore] = useState(0)
  const [activeTab, setActiveTab] = useState("write")
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)
  const [creativityLevel, setCreativityLevel] = useState([50])
  const [isSaved, setIsSaved] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // 示例平台特定提示
  const platformPrompts = {
    taobao: "编写吸引人的淘宝商品描述，突出产品特点和优势...",
    douyin: "创建简短有力的抖音商品文案，使用流行话题和吸引眼球的开场...",
    xiaohongshu: "撰写真实感强的小红书种草文案，分享个人使用体验和推荐理由...",
    wechat: "编写专业的微信公众号文章，深入分析行业趋势和见解...",
  }

  // 更新字数统计
  useEffect(() => {
    if (content) {
      setWordCount(content.trim().split(/\s+/).length)
      setCharacterCount(content.length)
    } else {
      setWordCount(0)
      setCharacterCount(0)
    }
  }, [content])

  // 模拟内容生成
  const generateContent = () => {
    setIsGenerating(true)
    setIsSaved(false)
    setSaveStatus("idle")

    // 模拟API调用延迟
    setTimeout(() => {
      const sampleContents = [
        "【这款超值套装让你爱不释手】\n\n✨ 精选优质材料，触感柔软舒适\n✨ 简约时尚设计，百搭各种场合\n✨ 多种颜色可选，总有一款适合你\n\n🔥 限时特惠，原价¥199，现在只需¥99！\n\n👉 快来抢购，数量有限，先到先得！",
        "【解锁夏日清爽新体验】\n\n☀️ 创新降温科技，瞬间降温10度\n☀️ 轻薄透气设计，随时随地保持干爽\n☀️ 便携可折叠，放包里不占空间\n\n⚡ 夏日必备神器，让你清凉一整天！\n\n🎁 下单即送精美收纳袋，数量有限哦~",
        "【高效办公的得力助手】\n\n💼 人体工学设计，长时间使用不疲劳\n💼 智能调节功能，满足不同使用需求\n💼 优质环保材质，安全耐用\n\n📈 提升工作效率30%，让你事半功倍！\n\n🔔 企业团购有优惠，详情请咨询客服~",
      ]

      const randomIndex = Math.floor(Math.random() * sampleContents.length)
      setContent(sampleContents[randomIndex])
      setQualityScore(Math.floor(Math.random() * 30) + 70) // 70-99之间的随机数
      setIsGenerating(false)
    }, 2000)
  }

  // 模拟保存内容
  const saveContent = () => {
    if (!content.trim()) {
      toast({
        title: "无法保存",
        description: "请先生成或编写内容",
        variant: "destructive",
      })
      return
    }

    setSaveStatus("saving")

    // 模拟保存延迟
    setTimeout(() => {
      setSaveStatus("saved")
      setIsSaved(true)
      toast({
        title: "保存成功",
        description: "您的内容已成功保存",
      })
    }, 1500)
  }

  // 复制到剪贴板
  const copyToClipboard = () => {
    if (!content.trim()) {
      toast({
        title: "无法复制",
        description: "请先生成或编写内容",
        variant: "destructive",
      })
      return
    }

    navigator.clipboard.writeText(content).then(
      () => {
        toast({
          title: "复制成功",
          description: "内容已复制到剪贴板",
        })
      },
      (err) => {
        toast({
          title: "复制失败",
          description: "无法复制内容: " + err,
          variant: "destructive",
        })
      },
    )
  }

  // 下载内容
  const downloadContent = () => {
    if (!content.trim()) {
      toast({
        title: "无法下载",
        description: "请先生成或编写内容",
        variant: "destructive",
      })
      return
    }

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `内容_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "下载成功",
      description: "内容已下载为文本文件",
    })
  }

  // 分享内容
  const shareContent = () => {
    if (!content.trim()) {
      toast({
        title: "无法分享",
        description: "请先生成或编写内容",
        variant: "destructive",
      })
      return
    }

    if (navigator.share) {
      navigator
        .share({
          title: "分享我的内容",
          text: content,
        })
        .then(() => {
          toast({
            title: "分享成功",
            description: "内容已成功分享",
          })
        })
        .catch((error) => {
          toast({
            title: "分享失败",
            description: `无法分享内容: ${error}`,
            variant: "destructive",
          })
        })
    } else {
      toast({
        title: "分享失败",
        description: "您的浏览器不支持分享功能",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-slate-800">
      <div className="p-4 border-b border-slate-800 bg-slate-900/60">
        <Tabs defaultValue="write" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="write">编写</TabsTrigger>
            <TabsTrigger value="settings">设置</TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">内容编辑器</h2>
                <ContentQualityScore score={qualityScore} />
              </div>

              <div className="relative">
                <Textarea
                  placeholder="在此输入或生成内容..."
                  className="min-h-[200px] md:min-h-[300px] resize-none bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-500"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value)
                    setIsSaved(false)
                    setSaveStatus("idle")
                  }}
                />
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-md">
                    <div className="flex flex-col items-center space-y-2">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                      <p className="text-sm text-slate-300">正在生成内容...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>字数: {wordCount}</span>
                <span>字符数: {characterCount}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <ButtonFeedback
                onClick={generateContent}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                feedbackText="生成中..."
                showFeedback={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                生成内容
              </ButtonFeedback>

              <Button
                variant="outline"
                size="sm"
                onClick={saveContent}
                disabled={isGenerating || saveStatus === "saving" || saveStatus === "saved"}
                className={cn(
                  "border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200",
                  saveStatus === "saved" && "border-green-700 bg-green-900/20 text-green-400",
                )}
              >
                {saveStatus === "saving" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : saveStatus === "saved" ? (
                  <CheckCircle className="mr-2 h-4 w-4" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saveStatus === "saving" ? "保存中..." : saveStatus === "saved" ? "已保存" : "保存"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                disabled={isGenerating || !content}
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
              >
                <Copy className="mr-2 h-4 w-4" />
                复制
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={downloadContent}
                disabled={isGenerating || !content}
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
              >
                <Download className="mr-2 h-4 w-4" />
                下载
              </Button>

              {!isMobile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareContent}
                  disabled={isGenerating || !content}
                  className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  分享
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-200 mb-2">创意程度</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">保守</span>
                  <Slider
                    value={creativityLevel}
                    onValueChange={setCreativityLevel}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-slate-400">创新</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  当前值: {creativityLevel[0]}%{" "}
                  {creativityLevel[0] < 30 ? "（保守）" : creativityLevel[0] > 70 ? "（创新）" : "（平衡）"}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-200">平台提示</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(platformPrompts).map(([platform, prompt]) => (
                    <div
                      key={platform}
                      className="p-3 rounded-md border border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setContent(prompt)
                        setActiveTab("write")
                      }}
                    >
                      <h4 className="text-sm font-medium text-slate-200 capitalize mb-1">{platform}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{prompt}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCreativityLevel([50])
                    toast({
                      title: "已重置",
                      description: "设置已恢复为默认值",
                    })
                  }}
                  className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  重置设置
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
