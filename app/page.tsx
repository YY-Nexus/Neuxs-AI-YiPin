import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  BrainCircuit,
  FileText,
  LineChart,
  Settings,
  TrendingUp,
  Zap,
  BookOpen,
  PenTool,
} from "lucide-react"
import { DashboardMetricCard } from "@/components/dashboard-metric-card"
import { DashboardChart } from "@/components/dashboard-chart"
import { HexagonButton } from "@/components/hexagon-button"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 to-blue-950">
      {/* 移除这里可能存在的 DashboardHeader 或 EnhancedNavigation 组件 */}
      <main className="flex-1 p-6 md:p-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">仪表盘</h1>
            <p className="text-muted-foreground text-blue-300">欢迎回来，查看您的 AI 助手最新数据和功能</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardMetricCard
              title="内容创作总数"
              value="128"
              change="+22%"
              icon={<FileText className="h-5 w-5" />}
            />
            <DashboardMetricCard
              title="数据分析次数"
              value="64"
              change="+15%"
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <DashboardMetricCard
              title="平均转化率"
              value="4.6%"
              change="+0.8%"
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <DashboardMetricCard
              title="AI 模型调用"
              value="256"
              change="+32%"
              icon={<BrainCircuit className="h-5 w-5" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-2 bg-slate-900/60 border-slate-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">数据趋势分析</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span>设置</span>
                  </Button>
                </div>
                <Tabs defaultValue="engagement">
                  <TabsList className="bg-slate-800/50 border border-slate-700">
                    <TabsTrigger
                      value="engagement"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      互动数据
                    </TabsTrigger>
                    <TabsTrigger
                      value="conversion"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      转化数据
                    </TabsTrigger>
                    <TabsTrigger
                      value="traffic"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      流量数据
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="engagement" className="mt-4">
                    <DashboardChart />
                  </TabsContent>
                  <TabsContent value="conversion" className="mt-4">
                    <DashboardChart />
                  </TabsContent>
                  <TabsContent value="traffic" className="mt-4">
                    <DashboardChart />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-white mb-4">快速操作</h3>
                <div className="grid grid-cols-2 gap-4">
                  <HexagonButton icon={<PenTool className="h-5 w-5" />} label="创建内容" />
                  <HexagonButton icon={<LineChart className="h-5 w-5" />} label="数据分析" />
                  <HexagonButton icon={<BookOpen className="h-5 w-5" />} label="学习课程" />
                  <HexagonButton icon={<Zap className="h-5 w-5" />} label="AI 助手" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-white mb-4">最近创建的内容</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800/80 transition-colors cursor-pointer group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">电商产品详情文案 #{i}</h4>
                        <p className="text-xs text-slate-400 truncate">创建于 2023-06-{10 + i}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                >
                  查看全部
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-white mb-4">推荐学习课程</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800/80 transition-colors cursor-pointer group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">电商平台爆款文案写作技巧 #{i}</h4>
                        <p className="text-xs text-slate-400 truncate">30分钟 · 初级</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                >
                  浏览课程库
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
