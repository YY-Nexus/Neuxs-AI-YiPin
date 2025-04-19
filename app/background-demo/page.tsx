"use client"

import { useState } from "react"
import { BackgroundSelector } from "@/components/background-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BarChart3, LineChart, PieChart, Settings } from "lucide-react"

export default function BackgroundDemoPage() {
  const [background, setBackground] = useState("/images/backgrounds/wave-pattern.jpeg")
  const [scope, setScope] = useState("card")

  const handleBackgroundChange = (backgroundId: string, scopeId: string) => {
    // 根据ID获取背景图片路径
    const bgPath = `/images/backgrounds/${backgroundId}.jpeg`
    setBackground(bgPath)
    setScope(scopeId)
  }

  return (
    <div
      className={cn("min-h-screen flex flex-col", scope === "page" && "bg-cover bg-center bg-no-repeat")}
      style={scope === "page" ? { backgroundImage: `url(${background})` } : {}}
    >
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <span className="font-bold text-white">YY</span>
              </div>
              <span className="font-bold text-white">Nexus AI</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BackgroundSelector
              onSelectBackground={handleBackgroundChange}
              defaultBackground="wave-pattern"
              defaultScope="card"
            />
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">背景图片演示</h1>
            <p className="text-muted-foreground text-blue-300">点击右上角的画笔图标选择不同的背景图片和应用范围</p>
          </div>

          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
              scope === "section" && "bg-cover bg-center bg-no-repeat rounded-xl p-6",
            )}
            style={scope === "section" ? { backgroundImage: `url(${background})` } : {}}
          >
            {[
              { title: "数据趋势", icon: LineChart, value: "↑ 24%" },
              { title: "用户分析", icon: BarChart3, value: "↑ 12%" },
              { title: "转化率", icon: PieChart, value: "↑ 8%" },
            ].map((item, index) => (
              <Card
                key={index}
                className={cn(
                  "bg-slate-900/60 border-slate-800 backdrop-blur-sm overflow-hidden relative",
                  scope === "card" && "bg-cover bg-center bg-no-repeat",
                )}
                style={scope === "card" ? { backgroundImage: `url(${background})` } : {}}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-white flex items-center justify-between">
                    {item.title}
                    <item.icon className="h-5 w-5 text-blue-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{item.value}</div>
                  <p className="text-sm text-slate-400 mt-1">相比上月</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">当前设置</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">背景图片:</span>
                    <span className="text-sm text-white">{background.split("/").pop()?.replace(".jpeg", "")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">应用范围:</span>
                    <span className="text-sm text-white">
                      {scope === "card" && "仅应用于卡片"}
                      {scope === "section" && "应用于分区"}
                      {scope === "page" && "应用于整个页面"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
