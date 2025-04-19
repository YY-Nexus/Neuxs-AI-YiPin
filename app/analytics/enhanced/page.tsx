"use client"

import { useState, useEffect } from "react"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Calendar,
  Filter,
  RefreshCw,
  FileText,
  Users,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { ChartContainer } from "@/components/analytics/chart-container"
import { MetricCard } from "@/components/analytics/metric-card"
import { LineChart } from "@/components/analytics/line-chart"
import { BarChart } from "@/components/analytics/bar-chart"
import { PieChart } from "@/components/analytics/pie-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// 模拟数据
const generateDailyData = (days: number, baseValue: number, volatility: number) => {
  const data = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // 生成随机波动
    const randomChange = (Math.random() - 0.5) * 2 * volatility
    const value = Math.max(0, baseValue + randomChange)

    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(value),
    })
  }

  return data
}

// 模拟流量来源数据
const trafficSourceData = [
  { label: "搜索引擎", value: 42 },
  { label: "社交媒体", value: 28 },
  { label: "直接访问", value: 18 },
  { label: "引荐链接", value: 12 },
]

// 模拟设备类型数据
const deviceTypeData = [
  { label: "移动设备", value: 65 },
  { label: "桌面设备", value: 30 },
  { label: "平板设备", value: 5 },
]

// 模拟内容类型数据
const contentTypeData = [
  { label: "产品描述", value: 45 },
  { label: "博客文章", value: 25 },
  { label: "社交媒体", value: 20 },
  { label: "电子邮件", value: 10 },
]

export default function EnhancedAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [viewsData, setViewsData] = useState<any[]>([])
  const [engagementData, setEngagementData] = useState<any[]>([])
  const [conversionData, setConversionData] = useState<any[]>([])
  const [topContentData, setTopContentData] = useState<any[]>([])

  // 模拟数据加载
  useEffect(() => {
    setIsLoading(true)

    // 模拟API请求延迟
    const timer = setTimeout(() => {
      setViewsData(generateDailyData(30, 800, 200))
      setEngagementData(generateDailyData(30, 200, 50))
      setConversionData(generateDailyData(30, 50, 15))

      setTopContentData([
        { label: "轻奢真丝连衣裙", value: 1245 },
        { label: "高级感羊绒大衣", value: 982 },
        { label: "法式复古小香风套装", value: 876 },
        { label: "简约百搭真皮小白鞋", value: 754 },
        { label: "优雅气质珍珠项链", value: 621 },
      ])

      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // 模拟数据刷新
  const handleRefresh = () => {
    setIsLoading(true)

    // 模拟API请求延迟
    setTimeout(() => {
      setViewsData(generateDailyData(30, 800, 200))
      setEngagementData(generateDailyData(30, 200, 50))
      setConversionData(generateDailyData(30, 50, 15))
      setIsLoading(false)
    }, 1500)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-blue-950">
        <main className="container mx-auto py-8 px-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">增强数据分析</h1>
              <p className="text-blue-300">全面的数据可视化和分析工具，帮助您做出明智决策</p>
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
                    <MetricCard
                      title="总浏览量"
                      value="24,892"
                      change="+12.5%"
                      icon={<FileText className="h-5 w-5 text-blue-300" />}
                      loading={isLoading}
                      trend="up"
                    />
                    <MetricCard
                      title="互动率"
                      value="18.3%"
                      change="+3.2%"
                      icon={<TrendingUp className="h-5 w-5 text-purple-300" />}
                      loading={isLoading}
                      trend="up"
                    />
                    <MetricCard
                      title="转化率"
                      value="4.6%"
                      change="-0.8%"
                      icon={<ShoppingCart className="h-5 w-5 text-green-300" />}
                      loading={isLoading}
                      trend="down"
                    />
                    <MetricCard
                      title="新用户"
                      value="1,248"
                      change="+22.4%"
                      icon={<Users className="h-5 w-5 text-orange-300" />}
                      loading={isLoading}
                      trend="up"
                    />
                  </div>

                  {/* 主要图表 */}
                  <ChartContainer
                    title="趋势分析"
                    description="过去30天的数据趋势"
                    onRefresh={handleRefresh}
                    isLoading={isLoading}
                    downloadFileName="trend-analysis.png"
                  >
                    <div className="h-[300px]">
                      <LineChart data={viewsData} height={300} color="#3b82f6" showArea={true} showPoints={true} />
                    </div>
                  </ChartContainer>

                  {/* 数据明细 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartContainer title="内容表现" description="按浏览量排序的热门内容" allowZoom={false}>
                      <div className="h-[300px]">
                        <BarChart data={topContentData} height={300} color="#8b5cf6" />
                      </div>
                    </ChartContainer>

                    <ChartContainer title="流量来源" description="用户访问来源分布" allowZoom={false}>
                      <div className="h-[300px]">
                        <PieChart
                          data={trafficSourceData}
                          height={300}
                          colors={["#3b82f6", "#8b5cf6", "#10b981", "#f97316"]}
                        />
                      </div>
                    </ChartContainer>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="mt-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <ChartContainer
                        title="内容浏览趋势"
                        description="过去30天的内容浏览量"
                        onRefresh={handleRefresh}
                        isLoading={isLoading}
                      >
                        <div className="h-[300px]">
                          <LineChart data={viewsData} height={300} color="#3b82f6" />
                        </div>
                      </ChartContainer>
                    </div>

                    <ChartContainer title="内容类型分布" description="按内容类型划分的浏览量" allowZoom={false}>
                      <div className="h-[300px]">
                        <PieChart
                          data={contentTypeData}
                          height={300}
                          colors={["#3b82f6", "#10b981", "#f97316", "#8b5cf6"]}
                        />
                      </div>
                    </ChartContainer>
                  </div>

                  <ChartContainer title="热门内容" description="按浏览量排序的热门内容" allowZoom={false}>
                    <div className="h-[300px]">
                      <BarChart data={topContentData} height={300} color="#3b82f6" />
                    </div>
                  </ChartContainer>
                </TabsContent>

                <TabsContent value="users" className="mt-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <ChartContainer
                        title="用户活跃度"
                        description="过去30天的用户活跃度"
                        onRefresh={handleRefresh}
                        isLoading={isLoading}
                      >
                        <div className="h-[300px]">
                          <LineChart data={engagementData} height={300} color="#10b981" />
                        </div>
                      </ChartContainer>
                    </div>

                    <ChartContainer title="设备类型分布" description="按设备类型划分的用户" allowZoom={false}>
                      <div className="h-[300px]">
                        <PieChart data={deviceTypeData} height={300} colors={["#f97316", "#3b82f6", "#8b5cf6"]} />
                      </div>
                    </ChartContainer>
                  </div>

                  <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">用户行为分析</CardTitle>
                      <CardDescription className="text-slate-400">此功能正在开发中，敬请期待...</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-12">
                      <div className="text-center">
                        <div className="h-16 w-16 rounded-full bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                          <Users className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">用户行为分析功能即将上线</h3>
                        <p className="text-slate-400 max-w-md">
                          我们正在开发更全面的用户行为分析功能，帮助您了解用户行为和偏好，提升用户体验。
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="conversion" className="mt-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartContainer
                      title="转化趋势"
                      description="过去30天的转化率"
                      onRefresh={handleRefresh}
                      isLoading={isLoading}
                    >
                      <div className="h-[300px]">
                        <LineChart data={conversionData} height={300} color="#f97316" />
                      </div>
                    </ChartContainer>

                    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white">转化漏斗</CardTitle>
                        <CardDescription className="text-slate-400">用户转化路径分析</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-slate-400">浏览</span>
                              <span className="text-sm text-white">24,892</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5">
                              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "100%" }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-slate-400">点击</span>
                              <span className="text-sm text-white">4,562</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5">
                              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "18.3%" }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-slate-400">加入购物车</span>
                              <span className="text-sm text-white">1,845</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5">
                              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "7.4%" }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-slate-400">结账</span>
                              <span className="text-sm text-white">1,145</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5">
                              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "4.6%" }}></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">转化率优化建议</CardTitle>
                      <CardDescription className="text-slate-400">基于数据分析的优化建议</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                              <ArrowUpRight className="h-4 w-4 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white">提高产品详情页转化率</h4>
                              <p className="text-xs text-slate-400 mt-1">
                                产品详情页的转化率低于行业平均水平。建议优化产品描述，突出产品卖点，添加更多高质量图片，
                                并增加用户评价展示，提高用户信任度。
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-green-900/30 flex items-center justify-center flex-shrink-0">
                              <ArrowUpRight className="h-4 w-4 text-green-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white">优化结账流程</h4>
                              <p className="text-xs text-slate-400 mt-1">
                                数据显示有30%的用户在结账过程中放弃购买。建议简化结账流程，减少表单字段，
                                提供多种支付方式，并添加进度指示器，提高用户完成购买的信心。
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                              <ArrowDownRight className="h-4 w-4 text-orange-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white">移动端转化率下降</h4>
                              <p className="text-xs text-slate-400 mt-1">
                                移动端转化率较上月下降了0.8%。建议优化移动端页面加载速度，改进移动端用户界面，
                                确保所有功能在移动设备上都能正常使用，提高移动端用户体验。
                              </p>
                            </div>
                          </div>
                        </div>
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
