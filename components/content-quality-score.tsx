"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { CircleCheck, AlertCircle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ContentQualityScoreProps {
  content: string
}

type ScoreCategory = {
  name: string
  score: number
  maxScore: number
  icon: React.ReactNode
  description: string
}

export function ContentQualityScore({ content }: ContentQualityScoreProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [overallScore, setOverallScore] = useState(0)
  const [categories, setCategories] = useState<ScoreCategory[]>([])

  // 模拟分析内容质量
  useEffect(() => {
    if (!content || content.length < 10) {
      setOverallScore(0)
      setCategories([])
      return
    }

    setIsAnalyzing(true)

    // 模拟分析延迟
    const timer = setTimeout(() => {
      // 基于内容长度和关键词密度等简单规则计算分数
      const lengthScore = Math.min(10, Math.floor(content.length / 20))
      const keywordScore = content.includes("真丝") && content.includes("连衣裙") ? 9 : 7
      const readabilityScore = content.split(".").length > 3 ? 8 : 6
      const engagementScore = content.includes("!") || content.includes("！") ? 9 : 7
      const seoScore = content.includes("限时") && content.includes("优惠") ? 8 : 6

      // 计算总分
      const total = Math.floor((lengthScore + keywordScore + readabilityScore + engagementScore + seoScore) / 5)

      setOverallScore(total)
      setCategories([
        {
          name: "内容长度",
          score: lengthScore,
          maxScore: 10,
          icon: <CircleCheck className="h-3 w-3" />,
          description: "评估文案的详细程度和完整性",
        },
        {
          name: "关键词使用",
          score: keywordScore,
          maxScore: 10,
          icon: <CircleCheck className="h-3 w-3" />,
          description: "评估关键词的使用频率和相关性",
        },
        {
          name: "可读性",
          score: readabilityScore,
          maxScore: 10,
          icon: <CircleCheck className="h-3 w-3" />,
          description: "评估文案的易读性和流畅度",
        },
        {
          name: "吸引力",
          score: engagementScore,
          maxScore: 10,
          icon: <CircleCheck className="h-3 w-3" />,
          description: "评估文案的吸引力和感染力",
        },
        {
          name: "SEO友好度",
          score: seoScore,
          maxScore: 10,
          icon: <CircleCheck className="h-3 w-3" />,
          description: "评估文案对搜索引擎的友好程度",
        },
      ])

      setIsAnalyzing(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [content])

  if (!content || content.length < 10) {
    return null
  }

  return (
    <div className="mt-4 border border-slate-800 rounded-lg overflow-hidden bg-slate-900/60 backdrop-blur-sm">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <span className="text-xs font-bold text-white">{isAnalyzing ? "..." : overallScore}</span>
          </div>
          <h3 className="text-sm font-medium text-white">内容质量评分</h3>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-slate-400 hover:text-white">
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs">AI实时评估您的内容质量</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="p-3 space-y-3">
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-2">
            <div className="animate-pulse flex space-x-2 items-center">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-slate-400 ml-2">分析中...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">总体评分</span>
              <div className="flex items-center">
                <span className="text-sm font-medium text-white mr-2">{overallScore}/10</span>
                <div
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    overallScore >= 8
                      ? "bg-green-900/50 text-green-400"
                      : overallScore >= 6
                        ? "bg-yellow-900/50 text-yellow-400"
                        : "bg-red-900/50 text-red-400",
                  )}
                >
                  {overallScore >= 8 ? "优秀" : overallScore >= 6 ? "良好" : "需改进"}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {categories.map((category) => (
                <TooltipProvider key={category.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">{category.name}</span>
                          <span className="text-slate-400">
                            {category.score}/{category.maxScore}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              category.score >= 8
                                ? "bg-gradient-to-r from-green-500 to-green-600"
                                : category.score >= 6
                                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                                  : "bg-gradient-to-r from-red-500 to-red-600",
                            )}
                            style={{ width: `${(category.score / category.maxScore) * 100}%` }}
                          />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="text-xs">{category.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 mt-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400">
                  {overallScore >= 8
                    ? "您的内容质量优秀，可以直接发布。"
                    : overallScore >= 6
                      ? "内容整体良好，可考虑增加产品细节和情感诉求。"
                      : "建议增加内容长度，并强化关键词使用和产品卖点。"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
