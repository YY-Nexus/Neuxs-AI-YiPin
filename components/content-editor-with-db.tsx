"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  Sparkles,
  RefreshCw,
  Save,
  Share2,
  Settings,
  Lightbulb,
  Maximize2,
  MinusCircle,
  PlusCircle,
  Download,
  Check,
  Copy,
  Loader2,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { contentService } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

// 定义内容类型接口
interface ContentData {
  id?: string
  user_id: string
  title: string
  keywords: string
  content: string
  created_at?: string
  updated_at: string
  metadata?: any
}

export function ContentEditorWithDB() {
  const [content, setContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [creativityLevel, setCreativityLevel] = useState([50])
  const [title, setTitle] = useState("轻奢真丝几何剪裁连衣裙")
  const [keywords, setKeywords] = useState("真丝,连衣裙,几何剪裁,优雅,高级感")
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [contentId, setContentId] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  // 加载保存的内容（如果有ID）
  useEffect(() => {
    if (contentId && user) {
      const loadContent = async () => {
        try {
          const { data, error } = await contentService.getContent(contentId)
          if (error) throw error
          if (data) {
            setTitle(data.title)
            setKeywords(data.keywords)
            setContent(data.content)
            // 如果有其他元数据，也可以加载
            if (data.metadata?.creativityLevel) {
              setCreativityLevel([data.metadata.creativityLevel])
            }
          }
        } catch (error) {
          console.error("Error loading content:", error)
          toast({
            title: "加载失败",
            description: "无法加载内容，请稍后再试",
            variant: "destructive",
          })
        }
      }

      loadContent()
    }
  }, [contentId, user, toast])

  const handleGenerate = () => {
    setIsGenerating(true)
    // 模拟生成过程
    setTimeout(() => {
      setContent(
        "这款新品连衣裙采用高级真丝面料，触感柔滑，穿着舒适。\n\n独特的几何剪裁设计，勾勒出完美曲线，尽显优雅气质。\n\n多种场合百搭，从商务会议到晚宴约会，都能轻松驾驭。\n\n限时优惠，原价¥599，现在购买仅需¥399！\n\n更有多色可选，赶紧下单，穿出专属于你的时尚态度！",
      )
      setIsGenerating(false)
      toast({
        title: "内容生成成功",
        description: "AI已为您生成文案内容",
      })
    }, 2000)
  }

  // 保存内容到数据库
  const handleSave = async () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录才能保存内容",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "保存失败",
        description: "内容不能为空",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const contentData: ContentData = {
        user_id: user.id,
        title,
        keywords,
        content,
        updated_at: new Date().toISOString(),
        metadata: {
          creativityLevel: creativityLevel[0],
        },
      }

      let result
      if (contentId) {
        // 更新现有内容
        result = await contentService.updateContent(contentId, contentData)
      } else {
        // 创建新内容
        result = await contentService.saveContent(contentData)
        if (result.data && result.data[0]?.id) {
          setContentId(result.data[0].id)
        }
      }

      if (result.error) throw result.error

      toast({
        title: "保存成功",
        description: "内容已保存到云端",
      })
    } catch (error: any) {
      console.error("Error saving content:", error)
      toast({
        title: "保存失败",
        description: error.message || "无法保存内容，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 导出内容
  const handleExport = () => {
    if (!content.trim()) {
      toast({
        title: "导出失败",
        description: "内容不能为空",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    // 创建导出数据
    const exportData = {
      title,
      keywords,
      content,
      exportedAt: new Date().toISOString(),
    }

    // 创建Blob对象
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    // 创建下载链接
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/\s+/g, "-")}-${new Date().getTime()}.json`
    document.body.appendChild(a)
    a.click()

    // 清理
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setIsExporting(false)
      toast({
        title: "导出成功",
        description: "内容已导出为JSON文件",
      })
    }, 1000)
  }

  // 复制内容到剪贴板
  const handleCopy = async () => {
    if (!content.trim()) {
      toast({
        title: "复制失败",
        description: "内容不能为空",
        variant: "destructive",
      })
      return
    }

    setIsCopying(true)

    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "复制成功",
        description: "内容已复制到剪贴板",
      })
    } catch (e) {
      toast({
        title: "复制失败",
        description: "无法复制内容，请稍后再试",
        variant: "destructive",
      })
    }

    setTimeout(() => {
      setIsCopying(false)
    }, 1000)
  }

  // 导出为Markdown
  const exportAsMarkdown = () => {
    if (!content.trim()) {
      toast({
        title: "导出失败",
        description: "内容不能为空",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    // 创建Markdown内容
    const markdownContent = `# ${title}\n\n**关键词**: ${keywords}\n\n${content}\n\n*导出时间: ${new Date().toLocaleString()}*`

    // 创建Blob对象
    const blob = new Blob([markdownContent], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)

    // 创建下载链接
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/\s+/g, "-")}-${new Date().getTime()}.md`
    document.body.appendChild(a)
    a.click()

    // 清理
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setIsExporting(false)
      toast({
        title: "导出成功",
        description: "内容已导出为Markdown文件",
      })
    }, 1000)
  }

  // 导出为纯文本
  const exportAsText = () => {
    if (!content.trim()) {
      toast({
        title: "导出失败",
        description: "内容不能为空",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    // 创建文本内容
    const textContent = `${title}\n\n关键词: ${keywords}\n\n${content}\n\n导出时间: ${new Date().toLocaleString()}`

    // 创建Blob对象
    const blob = new Blob([textContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    // 创建下载链接
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/\s+/g, "-")}-${new Date().getTime()}.txt`
    document.body.appendChild(a)
    a.click()

    // 清理
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setIsExporting(false)
      toast({
        title: "导出成功",
        description: "内容已导出为文本文件",
      })
    }, 1000)
  }

  return (
    <div className="flex-1 border-r border-slate-800 flex flex-col h-full overflow-hidden">
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">内容创作</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
            <Maximize2 className="h-4 w-4" />
            <span className="sr-only">全屏编辑</span>
          </Button>
        </div>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid grid-cols-2 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="editor" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              编辑器
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              生成设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">商品名称</label>
              <Input
                placeholder="输入商品名称"
                className="border-slate-700 bg-slate-800/50 text-slate-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">关键词（用逗号分隔）</label>
              <Input
                placeholder="输入关键词，用逗号分隔"
                className="border-slate-700 bg-slate-800/50 text-slate-200"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-400">商品描述</label>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <span>{content.length}</span>
                  <span>/</span>
                  <span>1000</span>
                </div>
              </div>
              <Textarea
                placeholder="输入商品描述或点击下方按钮生成"
                className="min-h-[200px] border-slate-700 bg-slate-800/50 text-slate-200 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={1000}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-400">创意程度</label>
                  <span className="text-sm text-slate-400">{creativityLevel}%</span>
                </div>
                <Slider
                  value={creativityLevel}
                  onValueChange={setCreativityLevel}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-blue-600"
                />
                <div className="flex justify-between mt-1 text-xs text-slate-500">
                  <span>保守</span>
                  <span>平衡</span>
                  <span>创意</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">文案风格</label>
                <div className="grid grid-cols-2 gap-2">
                  {["专业正式", "轻松活泼", "高级感", "亲切自然", "简约直接", "详细描述"].map((style) => (
                    <div
                      key={style}
                      className="flex items-center space-x-2 border border-slate-700 rounded-md p-2 cursor-pointer hover:bg-slate-800/70"
                    >
                      <div className="h-4 w-4 rounded-sm border border-slate-600 flex items-center justify-center">
                        {style === "高级感" && <div className="h-2 w-2 rounded-sm bg-blue-600" />}
                      </div>
                      <span className="text-sm text-slate-300">{style}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">字数控制</label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-r-none border-slate-700 bg-slate-800/50"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    className="h-8 rounded-none border-x-0 border-slate-700 bg-slate-800/50 text-center text-slate-200"
                    value="200"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-l-none border-slate-700 bg-slate-800/50"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="h-full flex flex-col">
          <div className="flex-1">{/* 这里可以放置编辑器的其他内容 */}</div>

          <div className="pt-4 border-t border-slate-800 mt-auto">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleGenerate}
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white gap-2"
                disabled={isGenerating}
              >
                {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {isGenerating ? "生成中..." : "AI 生成文案"}
              </Button>

              <Button
                variant="outline"
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 gap-2"
              >
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                智能优化
              </Button>

              <Button
                variant="outline"
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 gap-2"
                onClick={handleSave}
                disabled={isSaving || !content.trim() || !user}
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? "保存中..." : "保存"}
              </Button>

              <Button
                variant="outline"
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 gap-2"
                onClick={handleCopy}
                disabled={isCopying || !content.trim()}
              >
                {isCopying ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {isCopying ? "已复制" : "复制"}
              </Button>

              <div className="relative group">
                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 gap-2"
                  onClick={handleExport}
                  disabled={isExporting || !content.trim()}
                >
                  {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                  导出
                </Button>
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="bg-slate-800 border border-slate-700 rounded-md shadow-lg overflow-hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-slate-200 hover:bg-slate-700 rounded-none px-3"
                      onClick={exportAsText}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      导出为文本
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-slate-200 hover:bg-slate-700 rounded-none px-3"
                      onClick={exportAsMarkdown}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      导出为Markdown
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-slate-200 hover:bg-slate-700 rounded-none px-3"
                      onClick={handleExport}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      导出为JSON
                    </Button>
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="icon" className="ml-auto text-slate-400">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
