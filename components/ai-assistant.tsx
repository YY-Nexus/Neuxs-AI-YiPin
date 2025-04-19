"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Bot, Send, Sparkles, Loader2, ChevronDown, ChevronUp, X } from "lucide-react"

export function AIAssistant() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: "你好！我是你的AI助手，可以帮你优化内容、提供创意或回答问题。",
    },
  ])
  const { toast } = useToast()

  // 处理提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    // 添加用户消息
    const userMessage = { role: "user" as const, content: prompt }
    setConversation([...conversation, userMessage])
    setPrompt("")
    setIsLoading(true)

    // 模拟AI响应
    setTimeout(() => {
      const responses = [
        "我建议在文案中加入更多情感元素，与用户建立情感连接。例如：'这款产品不仅仅是一个工具，更是您生活品质的提升者...'",
        "根据最新的电商趋势，短视频带货文案应该简洁有力，建议控制在100字以内，并突出1-2个核心卖点。",
        "您的文案很好，但可以考虑添加一些社会证明，如用户评价或销售数据，增强可信度。",
        "分析您的目标受众，年轻消费者更喜欢轻松幽默的语调，而专业人士则偏好数据和专业术语。",
        "建议在文案开头使用问题式标题，如'想要解决XX问题吗？'这种AIDA模式在电商平台转化率更高。",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      const assistantMessage = { role: "assistant" as const, content: randomResponse }
      setConversation([...conversation, userMessage, assistantMessage])
      setIsLoading(false)
    }, 2000)
  }

  // 快速提示
  const quickPrompts = ["帮我优化这段文案", "如何提高转化率？", "生成吸引人的标题", "适合年轻人的表达方式"]

  // 清空对话
  const clearConversation = () => {
    setConversation([
      {
        role: "assistant",
        content: "对话已清空。有什么可以帮到你的？",
      },
    ])
    toast({
      title: "对话已清空",
      description: "所有历史消息已被删除",
    })
  }

  return (
    <div className={cn("space-y-4", isExpanded ? "h-[400px]" : "h-auto")}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-slate-200 flex items-center">
          <Bot className="mr-2 h-4 w-4 text-blue-400" />
          AI助手
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-slate-400"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>

      {isExpanded && (
        <>
          <div className="bg-slate-950/50 rounded-md border border-slate-800 h-[260px] overflow-y-auto p-3 space-y-3">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex text-sm p-2 rounded-lg",
                  message.role === "user" ? "bg-blue-900/20 text-blue-100 ml-4" : "bg-slate-800/50 text-slate-300 mr-4",
                )}
              >
                {message.role === "assistant" && <Bot className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0 text-blue-400" />}
                <p className="text-xs">{message.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center justify-center bg-slate-800/50 text-slate-300 p-2 rounded-lg mr-4">
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-400" />
                <p className="text-xs">AI正在思考...</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="输入问题或请求..."
              className="flex-1 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 text-sm"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || !prompt.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-medium text-slate-400">快速提示</h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-slate-500 hover:text-slate-400"
                onClick={clearConversation}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((quickPrompt) => (
                <button
                  key={quickPrompt}
                  type="button"
                  className="px-2 py-1 text-xs rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                  onClick={() => {
                    setPrompt(quickPrompt)
                  }}
                >
                  {quickPrompt}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {!isExpanded && (
        <Button
          variant="outline"
          className="w-full border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
          onClick={() => setIsExpanded(true)}
        >
          <Sparkles className="mr-2 h-4 w-4 text-blue-400" />
          获取AI帮助
        </Button>
      )}
    </div>
  )
}
