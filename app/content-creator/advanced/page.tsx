import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ContentQualityScore } from "@/components/content-quality-score"
import { ImageTextEditor } from "@/components/image-text-editor"
import { ABTesting } from "@/components/ab-testing"
import { ContentEditor } from "@/components/content-editor"

export default function AdvancedContentCreatorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 to-blue-950">
      <main className="flex-1 p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">高级内容创作</h1>
            <p className="text-muted-foreground text-blue-300">使用增强功能创建更有效的内容</p>
          </div>

          <Tabs defaultValue="quality" className="w-full">
            <TabsList className="bg-slate-800/50 border border-slate-700 w-full justify-start">
              <TabsTrigger value="quality" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                内容质量评分
              </TabsTrigger>
              <TabsTrigger
                value="image-text"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                图文混排编辑器
              </TabsTrigger>
              <TabsTrigger
                value="ab-testing"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                A/B 测试
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quality" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/60 backdrop-blur-sm h-[600px]">
                    <ContentEditor />
                  </div>
                </div>
                <div>
                  <ContentQualityScore content="这款新品连衣裙采用高级真丝面料，触感柔滑，穿着舒适。独特的几何剪裁设计，勾勒出完美曲线，尽显优雅气质。多种场合百搭，从商务会议到晚宴约会，都能轻松驾驭。限时优惠，原价¥599，现在购买仅需¥399！更有多色可选，赶紧下单，穿出专属于你的时尚态度！" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="image-text" className="mt-6">
              <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/60 backdrop-blur-sm h-[600px]">
                <ImageTextEditor />
              </div>
            </TabsContent>

            <TabsContent value="ab-testing" className="mt-6">
              <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/60 backdrop-blur-sm h-[600px]">
                <ABTesting />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
