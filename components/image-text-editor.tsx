"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ImageIcon,
  Trash2,
  MoveUp,
  MoveDown,
  Edit,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  FileImage,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { swapArrayElements } from "@/lib/array-utils"

type BlockType = "text" | "image" | "imageText"
type TextAlignment = "left" | "center" | "right"
type ImagePosition = "left" | "right"

interface Block {
  id: string
  type: BlockType
  content: string
  imageUrl?: string
  imagePosition?: ImagePosition
  textAlignment?: TextAlignment
}

export function ImageTextEditor() {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: "1",
      type: "text",
      content: "这款新品连衣裙采用高级真丝面料，触感柔滑，穿着舒适。",
      textAlignment: "left",
    },
    {
      id: "2",
      type: "imageText",
      content: "独特的几何剪裁设计，勾勒出完美曲线，尽显优雅气质。",
      imageUrl: "/placeholder.svg",
      imagePosition: "left",
      textAlignment: "left",
    },
    {
      id: "3",
      type: "image",
      content: "",
      imageUrl: "/placeholder.svg",
    },
  ])

  const [activeBlockId, setActiveBlockId] = useState<string | null>("1")
  const [editMode, setEditMode] = useState(false)

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: type === "text" || type === "imageText" ? "新段落内容" : "",
      imageUrl: type === "image" || type === "imageText" ? "/placeholder.svg" : undefined,
      imagePosition: type === "imageText" ? "left" : undefined,
      textAlignment: type === "text" || type === "imageText" ? "left" : undefined,
    }

    setBlocks([...blocks, newBlock])
    setActiveBlockId(newBlock.id)
  }

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, ...updates } : block)))
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id))
    if (activeBlockId === id) {
      setActiveBlockId(blocks[0]?.id || null)
    }
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((block) => block.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === blocks.length - 1)) {
      return
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1
    const newBlocks = [...blocks]

    // Use the utility function to safely swap elements
    swapArrayElements(newBlocks, index, targetIndex)

    setBlocks(newBlocks)
  }

  const activeBlock = blocks.find((block) => block.id === activeBlockId)

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">图文编辑器</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200",
                editMode ? "bg-blue-900/50 border-blue-700 text-blue-200" : "",
              )}
              onClick={() => setEditMode(!editMode)}
            >
              <Edit className="h-4 w-4 mr-1" />
              {editMode ? "预览模式" : "编辑模式"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
            >
              <Layout className="h-4 w-4 mr-1" />
              布局
            </Button>
          </div>
        </div>

        {editMode && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
              onClick={() => addBlock("text")}
            >
              <Type className="h-4 w-4 mr-1" />
              添加文本
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
              onClick={() => addBlock("image")}
            >
              <ImageIcon className="h-4 w-4 mr-1" />
              添加图片
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
              onClick={() => addBlock("imageText")}
            >
              <FileImage className="h-4 w-4 mr-1" />
              添加图文
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex h-full">
          <div className={cn("flex-1 p-4 overflow-y-auto", editMode ? "border-r border-slate-800" : "w-full")}>
            <div className="max-w-2xl mx-auto space-y-6">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className={cn(
                    "relative p-4 rounded-lg transition-all",
                    editMode && activeBlockId === block.id
                      ? "bg-slate-800/70 border border-blue-600/50"
                      : editMode
                        ? "hover:bg-slate-800/30 border border-transparent hover:border-slate-700 cursor-pointer"
                        : "",
                  )}
                  onClick={() => editMode && setActiveBlockId(block.id)}
                >
                  {block.type === "text" && (
                    <p
                      className={cn(
                        "text-slate-200",
                        block.textAlignment === "center" && "text-center",
                        block.textAlignment === "right" && "text-right",
                      )}
                    >
                      {block.content}
                    </p>
                  )}

                  {block.type === "image" && block.imageUrl && (
                    <div className="flex justify-center">
                      <img
                        src={block.imageUrl || "/placeholder.svg"}
                        alt="Content image"
                        className="max-w-full h-auto rounded-md"
                        width={400}
                        height={300}
                      />
                    </div>
                  )}

                  {block.type === "imageText" && block.imageUrl && (
                    <div
                      className={cn("flex items-center gap-4", block.imagePosition === "right" && "flex-row-reverse")}
                    >
                      <img
                        src={block.imageUrl || "/placeholder.svg"}
                        alt="Content image"
                        className="w-1/3 h-auto rounded-md"
                        width={200}
                        height={150}
                      />
                      <p
                        className={cn(
                          "flex-1 text-slate-200",
                          block.textAlignment === "center" && "text-center",
                          block.textAlignment === "right" && "text-right",
                        )}
                      >
                        {block.content}
                      </p>
                    </div>
                  )}

                  {editMode && activeBlockId === block.id && (
                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                        onClick={() => moveBlock(block.id, "up")}
                        disabled={blocks.indexOf(block) === 0}
                      >
                        <MoveUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                        onClick={() => deleteBlock(block.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                        onClick={() => moveBlock(block.id, "down")}
                        disabled={blocks.indexOf(block) === blocks.length - 1}
                      >
                        <MoveDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {editMode && activeBlock && (
            <div className="w-64 p-4 bg-slate-900/80 border-l border-slate-800 overflow-y-auto">
              <h3 className="text-sm font-medium text-white mb-4">块属性</h3>

              <div className="space-y-4">
                {(activeBlock.type === "text" || activeBlock.type === "imageText") && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">文本内容</label>
                    <Textarea
                      value={activeBlock.content}
                      onChange={(e) => updateBlock(activeBlock.id, { content: e.target.value })}
                      className="min-h-[100px] border-slate-700 bg-slate-800/50 text-slate-200 text-sm resize-none"
                    />

                    <div className="mt-2">
                      <label className="block text-xs font-medium text-slate-400 mb-1">文本对齐</label>
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
                    <label className="block text-xs font-medium text-slate-400 mb-1">图片 URL</label>
                    <Input
                      value={activeBlock.imageUrl || ""}
                      onChange={(e) => updateBlock(activeBlock.id, { imageUrl: e.target.value })}
                      className="border-slate-700 bg-slate-800/50 text-slate-200 text-sm"
                      placeholder="/placeholder.svg"
                    />

                    {activeBlock.type === "imageText" && (
                      <div className="mt-2">
                        <label className="block text-xs font-medium text-slate-400 mb-1">图片位置</label>
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
