"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  BarChart3,
  LineChart,
  PieChart,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Users,
  ShoppingCart,
  TrendingUp,
  Search,
  Share2,
  Globe,
  Link,
  FileText,
} from "lucide-react"
import { DashboardChart } from "@/components/dashboard-chart"
import { PageTransition } from "@/components/page-transition"

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // 模拟数据刷新
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-blue-950">
        <main className="container mx-auto py-8 px-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">数据分析</h1>
              <p className="text-blue-300">分析您的内容表现和用户互动数据</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList className="bg-slate-800/50 border border-slate-700 w-full sm:w-auto">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    概览
                  </TabsTrigger>
                  <TabsTrigger
                    value="content"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    内容分析
                  </TabsTrigger>
                  <TabsTrigger value="users" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    用户分析
                  </TabsTrigger>
                  <TabsTrigger
                    value="conversion"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    转化分析
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-0 space-y-6">
                  {/* 概览指标卡片 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-400">总浏览量</p>
                            <p className="text-2xl font-bold text-white mt-1">24,892</p>
                            <div className="flex items-center text-xs font-medium text-green-500 mt-1">
                              <ArrowUpRight className="mr-1 h-3 w-3" />
                              +12.5%
                            </div>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-blue-900/30 flex items-center justify-center">
                            <LineChart className="h-6 w-6 text-blue-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-400">互动率</p>
                            <p className="text-2xl font-bold text-white mt-1">18.3%</p>
                            <div className="flex items-center text-xs font-medium text-green-500 mt-1">
                              <ArrowUpRight className="mr-1 h-3 w-3" />
                              +3.2%
                            </div>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center">
                            <Zap className="h-6 w-6 text-purple-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-400">转化率</p>
                            <p className="text-2xl font-bold text-white mt-1">4.6%</p>
                            <div className="flex items-center text-xs font-medium text-red-500 mt-1">
                              <ArrowDownRight className="mr-1 h-3 w-3" />
                              -0.8%
                            </div>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-green-900/30 flex items-center justify-center">
                            <ShoppingCart className="h-6 w-6 text-green-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-400">新用户</p>
                            <p className="text-2xl font-bold text-white mt-1">1,248</p>
                            <div className="flex items-center text-xs font-medium text-green-500 mt-1">
                              <ArrowUpRight className="mr-1 h-3 w-3" />
                              +22.4%
                            </div>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-orange-900/30 flex items-center justify-center">
                            <Users className="h-6 w-6 text-orange-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 主要图表 */}
                  <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">趋势分析</CardTitle>
                          <CardDescription className="text-slate-400">过去30天的数据趋势</CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          导出
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-[300px]">
                        <DashboardChart />
                      </div>
                    </CardContent>
                  </Card>

                  {/* 数据明细 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                          内容表现
                        </CardTitle>
                        <CardDescription className="text-slate-400">按浏览量排序的热门内容</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold">
                                {i}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                  {i === 1
                                    ? "轻奢真丝几何剪裁连衣裙"
                                    : i === 2
                                      ? "高级感羊绒大衣"
                                      : i === 3
                                        ? "法式复古小香风套装"
                                        : "简约百搭真皮小白鞋"}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {Math.floor(5000 / i)} 次浏览 · {Math.floor(300 / i)} 次互动
                                </p>
                              </div>
                              <div className="flex items-center text-xs font-medium text-green-500">
                                <TrendingUp className="mr-1 h-3 w-3" />+{Math.floor(30 / i)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <PieChart className="h-5 w-5 mr-2 text-purple-400" />
                          流量来源
                        </CardTitle>
                        <CardDescription className="text-slate-400">用户访问来源分布</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            { name: "搜索引擎", value: "42%", change: "+5.2%" },
                            { name: "社交媒体", value: "28%", change: "+12.3%" },
                            { name: "直接访问", value: "18%", change: "-2.1%" },
                            { name: "引荐链接", value: "12%", change: "+3.7%" },
                          ].map((source, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div
                                className={`w-10 h-10 rounded-md flex items-center justify-center ${
                                  i === 0
                                    ? "bg-gradient-to-br from-purple-600 to-purple-800"
                                    : i === 1
                                      ? "bg-gradient-to-br from-blue-600 to-blue-800"
                                      : i === 2
                                        ? "bg-gradient-to-br from-green-600 to-green-800"
                                        : "bg-gradient-to-br from-orange-600 to-orange-800"
                                }`}
                              >
                                <div className="h-5 w-5 text-white">
                                  {i === 0 ? (
                                    <Search className="h-5 w-5" />
                                  ) : i === 1 ? (
                                    <Share2 className="h-5 w-5" />
                                  ) : i === 2 ? (
                                    <Globe className="h-5 w-5" />
                                  ) : (
                                    <Link className="h-5 w-5" />
                                  )}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white">{source.name}</p>
                                <p className="text-xs text-slate-400">{source.value} 的流量</p>
                              </div>
                              <div
                                className={`flex items-center text-xs font-medium ${
                                  source.change.startsWith("+") ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                {source.change.startsWith("+") ? (
                                  <ArrowUpRight className="mr-1 h-3 w-3" />
                                ) : (
                                  <ArrowDownRight className="mr-1 h-3 w-3" />
                                )}
                                {source.change}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="mt-0">
                  <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">内容分析</CardTitle>
                      <CardDescription className="text-slate-400">此功能正在开发中，敬请期待...</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-12">
                      <div className="text-center">
                        <div className="h-16 w-16 rounded-full bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                          <FileText className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">内容分析功能即将上线</h3>
                        <p className="text-slate-400 max-w-md">
                          我们正在开发更强大的内容分析功能，帮助您深入了解内容表现，优化创作策略。
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="users" className="mt-0">
                  <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">用户分析</CardTitle>
                      <CardDescription className="text-slate-400">此功能正在开发中，敬请期待...</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-12">
                      <div className="text-center">
                        <div className="h-16 w-16 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                          <Users className="h-8 w-8 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">用户分析功能即将上线</h3>
                        <p className="text-slate-400 max-w-md">
                          我们正在开发更全面的用户分析功能，帮助您了解用户行为和偏好，提升用户体验。
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="conversion" className="mt-0">
                  <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">转化分析</CardTitle>
                      <CardDescription className="text-slate-400">此功能正在开发中，敬请期待...</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-12">
                      <div className="text-center">
                        <div className="h-16 w-16 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                          <ShoppingCart className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">转化分析功能即将上线</h3>
                        <p className="text-slate-400 max-w-md">
                          我们正在开发更精准的转化分析功能，帮助您追踪转化漏斗，优化营销策略。
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  最近30天
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  筛选
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
