"use client"

import { PageTransition } from "@/components/page-transition"
import { OptimizedImageTextEditor } from "@/components/image-text-editor/optimized-editor"

export default function OptimizedEditorPage() {
  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 to-blue-950">
        <main className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">优化图文编辑器</h1>
              <p className="text-muted-foreground text-blue-300">使用组件拆分和状态管理优化的编辑器</p>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/60 backdrop-blur-sm h-[calc(100vh-220px)]">
              <OptimizedImageTextEditor />
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
