import { PageTransition } from "@/components/page-transition"
import { ImageTextEditorEnhanced } from "@/components/image-text-editor-enhanced"

export default function EnhancedContentCreatorPage() {
  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 to-blue-950">
        {/* 不需要在这里添加导航组件，已在 layout.tsx 中添加 */}
        <main className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">增强内容创作</h1>
              <p className="text-muted-foreground text-blue-300">使用AI图片生成功能创建更丰富的内容</p>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/60 backdrop-blur-sm h-[calc(100vh-220px)]">
              <ImageTextEditorEnhanced />
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
