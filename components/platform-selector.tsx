"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const platforms = [
  {
    id: "taobao",
    name: "淘宝",
    icon: "🛒",
    description: "适合淘宝详情页和推广文案",
  },
  {
    id: "douyin",
    name: "抖音",
    icon: "🎵",
    description: "适合抖音短视频和直播文案",
  },
  {
    id: "xiaohongshu",
    name: "小红书",
    icon: "📔",
    description: "适合小红书种草和分享文案",
  },
  {
    id: "wechat",
    name: "微信",
    icon: "💬",
    description: "适合微信公众号和朋友圈文案",
  },
  {
    id: "weibo",
    name: "微博",
    icon: "🔍",
    description: "适合微博热门话题和推广",
  },
  {
    id: "jd",
    name: "京东",
    icon: "🛍️",
    description: "适合京东商品详情和促销",
  },
]

export function PlatformSelector() {
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0])

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-200">选择平台</h3>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
          >
            <div className="flex items-center">
              <span className="mr-2">{selectedPlatform.icon}</span>
              <span>{selectedPlatform.name}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] bg-slate-900 border-slate-800">
          {platforms.map((platform) => (
            <DropdownMenuItem
              key={platform.id}
              className={cn(
                "flex items-center justify-between cursor-pointer",
                selectedPlatform.id === platform.id && "bg-blue-900/20 text-blue-100",
              )}
              onClick={() => setSelectedPlatform(platform)}
            >
              <div className="flex items-center">
                <span className="mr-2">{platform.icon}</span>
                <span>{platform.name}</span>
              </div>
              {selectedPlatform.id === platform.id && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="text-xs text-slate-400">{selectedPlatform.description}</div>

      <div className="pt-2 space-y-2">
        <h4 className="text-xs font-medium text-slate-400">热门话题</h4>
        <div className="flex flex-wrap gap-2">
          {["夏季新品", "618大促", "直播爆款", "学生党必备", "高性价比"].map((tag) => (
            <div
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer transition-colors"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
