"use client"

import { cn } from "@/lib/utils"
import { useEditor, type Block } from "./editor-context"
import { Button } from "@/components/ui/button"
import { MoveUp, MoveDown, Trash2 } from "lucide-react"

interface BlockContentProps {
  block: Block
}

export function BlockContent({ block }: BlockContentProps) {
  const { activeBlockId, editMode, setActiveBlockId, deleteBlock, moveBlock } = useEditor()
  const isActive = activeBlockId === block.id

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg transition-all",
        editMode && isActive
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
        <div className={cn("flex items-center gap-4", block.imagePosition === "right" && "flex-row-reverse")}>
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

      {editMode && isActive && (
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            onClick={() => moveBlock(block.id, "up")}
            disabled={false} // 这里应该根据实际情况设置
            aria-label="向上移动"
          >
            <MoveUp className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            onClick={() => deleteBlock(block.id)}
            aria-label="删除"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            onClick={() => moveBlock(block.id, "down")}
            disabled={false} // 这里应该根据实际情况设置
            aria-label="向下移动"
          >
            <MoveDown className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
