import { ContentEditor } from "@/components/content-editor"
import { PlatformSelector } from "@/components/platform-selector"
import { ContentPreview } from "@/components/content-preview"
import { AIAssistant } from "@/components/ai-assistant"

export default function ContentCreatorPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">内容创作中心</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-800 p-4">
            <PlatformSelector />
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-800 p-4">
            <AIAssistant />
          </div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-800 overflow-hidden">
            <ContentEditor />
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-800 overflow-hidden">
            <ContentPreview />
          </div>
        </div>
      </div>
    </div>
  )
}
