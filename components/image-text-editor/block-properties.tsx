"use client"

import { useEditor } from "./editor-context"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function BlockProperties() {
  const { activeBlockId, blocks, updateBlock } = useEditor()
  const activeBlock = blocks.find((block) => block.id === activeBlockId)

  if (!activeBlock) return null

  return (
    <div className="space-y-4">
      {(activeBlock.type === "text" || activeBlock.type === "imageText") && (
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">文本内容</label>
          <Textarea
            value={activeBlock.content}
            onChange={(e) => updateBlock(activeBlock.id, { content: e.target.value })}
            className="min-h-[100px] border-slate-700 bg-slate-800/50 text-slate-200 resize-none"
          />

          <div className="mt-2">
            <label className="block text-sm font-medium text-slate-400 mb-1">文本对齐</label>
            <div className="flex border border-slate-700 rounded-md overflow-hidden">
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "flex-1 h-8 rounded-none",
                  activeBlock.textAlignment === "left" ? "bg-blue-900/50 text-blue-200" : "text-slate-400",
                )}
                onClick={() => updateBlock(activeBlock.id, { textAlignment: "left" })}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "flex-1 h-8 rounded-none border-l border-r border-slate-700",
                  activeBlock.textAlignment === "center" ? "bg-blue-900/50 text-blue-200" : "text-slate-400",
                )}
                onClick={() => updateBlock(activeBlock.id, { textAlignment: "center" })}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "flex-1 h-8 rounded-none",
                  activeBlock.textAlignment === "right" ? "bg-blue-900/50 text-blue-200" : "text-slate-400",
                )}
                onClick={() => updateBlock(activeBlock.id, { textAlignment: "right" })}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {(activeBlock.type === "image" || activeBlock.type === "imageText") && (
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">图片 URL</label>
          <Input
            value={activeBlock.imageUrl || ""}
            onChange={(e) => updateBlock(activeBlock.id, { imageUrl: e.target.value })}
            className="border-slate-700 bg-slate-800/50 text-slate-200 text-sm"
            placeholder="/placeholder.svg"
          />

          {activeBlock.type === "imageText" && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-slate-400 mb-1">图片位置</label>
              <div className="flex border border-slate-700 rounded-md overflow-hidden">
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "flex-1 h-8 rounded-none",
                    activeBlock.imagePosition === "left" ? "bg-blue-900/50 text-blue-200" : "text-slate-400",
                  )}
                  onClick={() => updateBlock(activeBlock.id, { imagePosition: "left" })}
                >
                  <span className="text-xs">左侧</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "flex-1 h-8 rounded-none border-l border-slate-700",
                    activeBlock.imagePosition === "right" ? "bg-blue-900/50 text-blue-200" : "text-slate-400",
                  )}
                  onClick={() => updateBlock(activeBlock.id, { imagePosition: "right" })}
                >
                  <span className="text-xs">右侧</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
