"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Smartphone, Tablet, Laptop, Download, Share2, ThumbsUp, ThumbsDown } from "lucide-react"

export function ContentPreview() {
  const [activeDevice, setActiveDevice] = useState<"mobile" | "tablet" | "desktop">("mobile")
  const [activeTab, setActiveTab] = useState("preview")
  const { toast } = useToast()

  // 示例内容
  const previewContent = `
    <div style="font-family: system-ui, sans-serif; color: #333;">
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <h2 style="color: #1a73e8; margin-top: 0;">【这款超值套装让你爱不释手】</h2>
        <p style="margin: 8px 0;">✨ 精选优质材料，触感柔软舒适<br>
        ✨ 简约时尚设计，百搭各种场合<br>
        ✨ 多种颜色可选，总有一款适合你</p>
        <p style="font-weight: bold; color: #e53935; margin: 12px 0;">
          🔥 限时特惠，原价¥199，现在只需¥99！
        </p>
        <p style="color: #0d47a1;">
          👉 快来抢购，数量有限，先到先得！
        </p>
      </div>
      <div style="display: flex; justify-content: center; margin: 15px 0;">
        <img src="/placeholder.svg?height=200&width=200" alt="产品图片" style="max-width: 100%; border-radius: 4px;">
      </div>
    </div>
  `

  // 设备尺寸类
  const deviceClasses = {
    mobile: "w-[320px] h-[568px]",
    tablet: "w-[768px] h-[500px]",
    desktop: "w-full max-w-[1024px] h-[500px]",
  }

  // 反馈功能
  const handleFeedback = (type: "positive" | "negative") => {
    toast({
      title: type === "positive" ? "感谢您的好评！" : "感谢您的反馈",
      description: type === "positive" ? "我们会继续提供优质内容" : "我们会努力改进",
    })
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-900/60">
        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="preview">预览</TabsTrigger>
            <TabsTrigger value="analytics">分析</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">内容预览</h2>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  className={`p-1 h-8 w-8 ${
                    activeDevice === "mobile" ? "bg-blue-900/30 text-blue-100" : "bg-slate-800 text-slate-400"
                  }`}
                  onClick={() => setActiveDevice("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                  <span className="sr-only">手机</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`p-1 h-8 w-8 ${
                    activeDevice === "tablet" ? "bg-blue-900/30 text-blue-100" : "bg-slate-800 text-slate-400"
                  }`}
                  onClick={() => setActiveDevice("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                  <span className="sr-only">平板</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`p-1 h-8 w-8 ${
                    activeDevice === "desktop" ? "bg-blue-900/30 text-blue-100" : "bg-slate-800 text-slate-400"
                  }`}
                  onClick={() => setActiveDevice("desktop")}
                >
                  <Laptop className="h-4 w-4" />
                  <span className="sr-only">桌面</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-center overflow-auto bg-slate-950/30 rounded-md p-4">
              <div
                className={`${deviceClasses[activeDevice]} bg-white rounded-md overflow-auto shadow-lg flex-shrink-0`}
              >
                <div className="h-6 bg-gray-200 flex items-center px-2 space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="text-xs text-gray-500 ml-2 truncate">
                    {activeDevice === "mobile" ? "手机预览" : activeDevice === "tablet" ? "平板预览" : "桌面预览"}
                  </div>
                </div>
                <div
                  className="p-4 overflow-auto"
                  style={{ height: "calc(100% - 24px)" }}
                  dangerouslySetInnerHTML={{ __html: previewContent }}
                ></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                onClick={() => {
                  toast({
                    title: "已下载预览图",
                    description: "预览图已保存到您的设备",
                  })
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                下载预览
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                onClick={() => {
                  toast({
                    title: "分享功能",
                    description: "分享功能即将上线",
                  })
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                分享预览
              </Button>
              <div className="ml-auto flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 bg-slate-800/50 hover:bg-green-900/20 text-slate-200 hover:text-green-400 hover:border-green-800"
                  onClick={() => handleFeedback("positive")}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  满意
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 bg-slate-800/50 hover:bg-red-900/20 text-slate-200 hover:text-red-400 hover:border-red-800"
                  onClick={() => handleFeedback("negative")}
                >
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  不满意
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <h2 className="text-lg font-semibold text-white">内容分析</h2>

            <div className="space-y-4 bg-slate-950/30 rounded-md p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 rounded-md p-3 border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">预估阅读时间</div>
                  <div className="text-xl font-semibold text-white">1分钟</div>
                </div>
                <div className="bg-slate-900 rounded-md p-3 border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">情感倾向</div>
                  <div className="text-xl font-semibold text-green-400">积极</div>
                </div>
                <div className="bg-slate-900 rounded-md p-3 border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">关键词密度</div>
                  <div className="text-xl font-semibold text-white">适中</div>
                </div>
                <div className="bg-slate-900 rounded-md p-3 border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">可读性评分</div>
                  <div className="text-xl font-semibold text-white">85/100</div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-md p-3 border border-slate-800">
                <div className="text-xs text-slate-500 mb-2">热门关键词</div>
                <div className="flex flex-wrap gap-2">
                  {["超值", "套装", "限时特惠", "优质材料", "时尚设计"].map((keyword) => (
                    <div
                      key={keyword}
                      className="px-2 py-1 text-xs rounded-full bg-blue-900/20 text-blue-300 border border-blue-800/50"
                    >
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-md p-3 border border-slate-800">
                <div className="text-xs text-slate-500 mb-2">改进建议</div>
                <ul className="text-sm text-slate-300 space-y-1 pl-5 list-disc">
                  <li>添加更多产品具体参数，增强说服力</li>
                  <li>考虑增加用户评价，提高信任度</li>
                  <li>可以添加更多促销细节，如优惠截止日期</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
