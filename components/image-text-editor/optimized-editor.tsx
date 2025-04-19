"use client"

import { cn } from "@/lib/utils"
import { EditorProvider } from "./editor-context"
import { EditorToolbar } from "./editor-toolbar"
import { BlockContent } from "./block-content"
import { BlockProperties } from "./block-properties"
import { useEditor } from "./editor-context"

function EditorContent() {
  const { blocks, editMode, activeBlockId } = useEditor()

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex h-full">
        <div className={cn("flex-1 p-4 overflow-y-auto", editMode ? "border-r border-slate-800" : "w-full")}>
          <div className="max-w-2xl mx-auto space-y-6">
            {blocks.map((block) => (
              <BlockContent key={block.id} block={block} />
            ))}
          </div>
        </div>

        {editMode && activeBlockId && (
          <div className="w-64 p-4 bg-slate-900/80 border-l border-slate-800 overflow-y-auto">
            <h3 className="text-sm font-medium text-white mb-4">块属性</h3>
            <BlockProperties />
          </div>
        )}
      </div>
    </div>
  )
}

export function OptimizedImageTextEditor() {
  return (
    <EditorProvider>
      <div className="flex flex-col h-full">
        <EditorToolbar />
        <EditorContent />
      </div>
    </EditorProvider>
  )
}
