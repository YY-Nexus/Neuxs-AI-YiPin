"use client"

import { Button } from "@/components/ui/button"
import { Edit, Layout, Type, ImageIcon, FileImage, Undo2, Redo2, History } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "./editor-context"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function EditorToolbar() {
  const { editMode, setEditMode, addBlock, undo, redo, canUndo, canRedo } = useEditor()

  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)

  return (
    <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-white">图文编辑器</h2>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                  onClick={undo}
                  disabled={!canUndo}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">撤销 (Ctrl+Z)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                  onClick={redo}
                  disabled={!canRedo}
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">重做 (Ctrl+Y)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">历史记录</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800">
              <DropdownMenuItem
                className="text-slate-200 focus:bg-slate-800 focus:text-white cursor-pointer"
                onClick={() => setHistoryDialogOpen(true)}
              >
                查看完整历史记录
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-slate-200 focus:bg-slate-800 focus:text-white cursor-pointer"
                onClick={undo}
                disabled={!canUndo}
              >
                撤销上一步操作
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-slate-200 focus:bg-slate-800 focus:text-white cursor-pointer"
                onClick={redo}
                disabled={!canRedo}
              >
                重做下一步操作
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
  )
}
