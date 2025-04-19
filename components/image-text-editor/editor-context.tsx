"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useHistory } from "@/hooks/use-history"

// 块类型定义
export type BlockType = "text" | "image" | "imageText"
export type TextAlignment = "left" | "center" | "right"
export type ImagePosition = "left" | "right"

export interface Block {
  id: string
  type: BlockType
  content: string
  imageUrl?: string
  imagePosition?: ImagePosition
  textAlignment?: TextAlignment
}

// 编辑器上下文类型
interface EditorContextType {
  // 状态
  blocks: Block[]
  activeBlockId: string | null
  editMode: boolean

  // 块操作
  setActiveBlockId: (id: string | null) => void
  setEditMode: (mode: boolean) => void
  addBlock: (type: BlockType) => void
  updateBlock: (id: string, updates: Partial<Block>) => void
  deleteBlock: (id: string) => void
  moveBlock: (id: string, direction: "up" | "down") => void

  // 历史记录
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void

  // 辅助方法
  getActiveBlock: () => Block | undefined
}

// 创建上下文
const EditorContext = createContext<EditorContextType | undefined>(undefined)

// 初始块数据
const initialBlocks: Block[] = [
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
]

// 提供者组件
export function EditorProvider({ children }: { children: ReactNode }) {
  // 使用历史记录钩子管理块数据
  const { state: blocks, updateState: setBlocks, undo, redo, canUndo, canRedo } = useHistory<Block[]>(initialBlocks)

  const [activeBlockId, setActiveBlockId] = useState<string | null>("1")
  const [editMode, setEditMode] = useState(false)
  const { toast } = useToast()

  // 添加块
  const addBlock = useCallback(
    (type: BlockType) => {
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

      toast({
        title: "添加成功",
        description: `已添加${type === "text" ? "文本" : type === "image" ? "图片" : "图文"}块`,
      })
    },
    [blocks, setBlocks, setActiveBlockId, toast],
  )

  // 更新块
  const updateBlock = useCallback(
    (id: string, updates: Partial<Block>) => {
      setBlocks(blocks.map((block) => (block.id === id ? { ...block, ...updates } : block)))
    },
    [blocks, setBlocks],
  )

  // 删除块
  const deleteBlock = useCallback(
    (id: string) => {
      if (blocks.length <= 1) {
        toast({
          title: "无法删除",
          description: "至少需要保留一个内容块",
          variant: "destructive",
        })
        return
      }

      setBlocks(blocks.filter((block) => block.id !== id))

      if (activeBlockId === id) {
        setActiveBlockId(blocks[0]?.id || null)
      }

      toast({
        title: "删除成功",
        description: "内容块已删除",
      })
    },
    [blocks, setBlocks, activeBlockId, setActiveBlockId, toast],
  )

  // 移动块
  const moveBlock = useCallback(
    (id: string, direction: "up" | "down") => {
      const index = blocks.findIndex((block) => block.id === id)
      if ((direction === "up" && index === 0) || (direction === "down" && index === blocks.length - 1)) {
        return
      }

      const newBlocks = [...blocks]
      const targetIndex = direction === "up" ? index - 1 : index + 1

      // 交换元素
      const temp = newBlocks[index]
      newBlocks[index] = newBlocks[targetIndex]
      newBlocks[targetIndex] = temp

      setBlocks(newBlocks)
    },
    [blocks, setBlocks],
  )

  // 获取当前活动块
  const getActiveBlock = useCallback(() => {
    return blocks.find((block) => block.id === activeBlockId)
  }, [blocks, activeBlockId])

  // 创建上下文值
  const contextValue = useMemo(
    () => ({
      blocks,
      activeBlockId,
      editMode,
      setActiveBlockId,
      setEditMode,
      addBlock,
      updateBlock,
      deleteBlock,
      moveBlock,
      canUndo,
      canRedo,
      undo,
      redo,
      getActiveBlock,
    }),
    [
      blocks,
      activeBlockId,
      editMode,
      setActiveBlockId,
      setEditMode,
      addBlock,
      updateBlock,
      deleteBlock,
      moveBlock,
      canUndo,
      canRedo,
      undo,
      redo,
      getActiveBlock,
    ],
  )

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>
}

// 自定义钩子
export function useEditor() {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider")
  }
  return context
}
