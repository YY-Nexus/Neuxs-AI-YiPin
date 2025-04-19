"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, Paintbrush } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// 背景图片数据
const backgroundImages = [
  {
    id: "wave-pattern",
    name: "波浪纹理",
    description: "流畅的蓝色波浪纹理，给人平静科技感",
    path: "/images/backgrounds/wave-pattern.jpeg",
  },
  {
    id: "geometric-angles",
    name: "几何角度",
    description: "动态的蓝色几何图形，展现现代科技风格",
    path: "/images/backgrounds/geometric-angles.jpeg",
  },
  {
    id: "deep-waves",
    name: "深蓝波浪",
    description: "深邃的蓝色背景与流动的波浪线条",
    path: "/images/backgrounds/deep-waves.jpeg",
  },
  {
    id: "wave-circles",
    name: "波浪与圆点",
    description: "波浪线条与散布的圆点，科技感十足",
    path: "/images/backgrounds/wave-circles.jpeg",
  },
  {
    id: "tech-squares",
    name: "科技方块",
    description: "几何方块与点阵图案，现代数字风格",
    path: "/images/backgrounds/tech-squares.jpeg",
  },
]

// 背景应用范围选项
const scopeOptions = [
  { id: "card", label: "仅应用于卡片" },
  { id: "section", label: "应用于分区" },
  { id: "page", label: "应用于整个页面" },
]

interface BackgroundSelectorProps {
  onSelectBackground?: (background: string, scope: string) => void
  defaultBackground?: string
  defaultScope?: string
}

export function BackgroundSelector({
  onSelectBackground,
  defaultBackground = "wave-pattern",
  defaultScope = "card",
}: BackgroundSelectorProps) {
  const [selectedBackground, setSelectedBackground] = useState(defaultBackground)
  const [selectedScope, setSelectedScope] = useState(defaultScope)
  const [isOpen, setIsOpen] = useState(false)

  // 当选择改变时更新状态
  useEffect(() => {
    if (onSelectBackground) {
      onSelectBackground(selectedBackground, selectedScope)
    }
  }, [selectedBackground, selectedScope, onSelectBackground])

  // 应用背景
  const applyBackground = () => {
    if (onSelectBackground) {
      onSelectBackground(selectedBackground, selectedScope)
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
              >
                <Paintbrush className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">选择背景图片</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">选择背景图片</DialogTitle>
          <DialogDescription className="text-slate-400">为您的界面选择合适的背景图片，提升视觉体验</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">背景图片</h3>
            <div className="grid grid-cols-2 gap-3">
              {backgroundImages.map((bg) => (
                <div
                  key={bg.id}
                  className={cn(
                    "relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all",
                    selectedBackground === bg.id
                      ? "border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]"
                      : "border-transparent hover:border-slate-700",
                  )}
                  onClick={() => setSelectedBackground(bg.id)}
                >
                  <img src={bg.path || "/placeholder.svg"} alt={bg.name} className="w-full h-24 object-cover" />
                  {selectedBackground === bg.id && (
                    <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-xs font-medium text-white">{bg.name}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-medium text-white mb-2">应用范围</h3>
              <RadioGroup value={selectedScope} onValueChange={setSelectedScope} className="flex flex-col space-y-2">
                {scopeOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 rounded-md border border-slate-800 p-2 hover:bg-slate-800/50"
                  >
                    <RadioGroupItem value={option.id} id={option.id} className="text-blue-500" />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer text-sm text-slate-300">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">预览</h3>
            <div className="relative rounded-lg overflow-hidden border border-slate-800 h-[300px]">
              <img
                src={backgroundImages.find((bg) => bg.id === selectedBackground)?.path || backgroundImages[0].path}
                alt="预览"
                className="w-full h-full object-cover"
              />
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  selectedScope === "card" && "p-8",
                  selectedScope === "section" && "p-4",
                )}
              >
                {selectedScope === "card" && (
                  <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-800 w-full h-full flex items-center justify-center">
                    <p className="text-white text-sm">卡片内容区域</p>
                  </div>
                )}
                {selectedScope === "section" && (
                  <div className="bg-transparent w-full h-full flex flex-col gap-4 p-4">
                    <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-800 h-1/2 flex items-center justify-center">
                      <p className="text-white text-sm">卡片 1</p>
                    </div>
                    <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-800 h-1/2 flex items-center justify-center">
                      <p className="text-white text-sm">卡片 2</p>
                    </div>
                  </div>
                )}
                {selectedScope === "page" && (
                  <div className="bg-transparent w-full h-full flex flex-col">
                    <div className="h-12 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex items-center px-4">
                      <p className="text-white text-sm">导航栏</p>
                    </div>
                    <div className="flex-1 p-4 flex gap-4">
                      <div className="w-1/3 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-800 flex items-center justify-center">
                        <p className="text-white text-xs">侧边栏</p>
                      </div>
                      <div className="flex-1 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-800 flex items-center justify-center">
                        <p className="text-white text-xs">主内容区</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium text-white mb-1">
                {backgroundImages.find((bg) => bg.id === selectedBackground)?.name}
              </h4>
              <p className="text-xs text-slate-400">
                {backgroundImages.find((bg) => bg.id === selectedBackground)?.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
          >
            取消
          </Button>
          <Button
            onClick={applyBackground}
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white"
          >
            应用背景
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
