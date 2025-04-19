"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  PenTool,
  LineChart,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  FileText,
  ImageIcon,
  TestTube2,
  History,
  Paintbrush,
  Layers,
  Zap,
  Brain,
  Sparkles,
  Laptop,
} from "lucide-react"
import { cn } from "@/lib/utils"

// 定义功能状态类型
type FeatureStatus = "完成" | "进行中" | "计划中" | "待审核"

// 定义功能项接口
interface FeatureItem {
  id: string
  name: string
  description: string
  path: string
  icon: React.ElementType
  status: FeatureStatus
  category: string
  buttons?: {
    name: string
    status: "正常" | "待完善" | "缺失"
    description?: string
  }[]
}

// 所有功能列表
const features: FeatureItem[] = [
  {
    id: "dashboard",
    name: "仪表盘",
    description: "平台概览，显示关键指标和快速访问入口",
    path: "/",
    icon: Home,
    status: "完成",
    category: "核心",
    buttons: [
      { name: "快速操作按钮", status: "正常" },
      { name: "查看全部按钮", status: "正常" },
      { name: "设置按钮", status: "正常" },
    ],
  },
  {
    id: "content-creator",
    name: "内容创作",
    description: "基础内容创作工具，支持AI生成文案",
    path: "/content-creator",
    icon: PenTool,
    status: "完成",
    category: "内容",
    buttons: [
      { name: "AI生成按钮", status: "正常" },
      { name: "智能优化按钮", status: "待完善", description: "功能尚未完全实现" },
      { name: "保存按钮", status: "待完善", description: "需要实现保存功能" },
      { name: "导出按钮", status: "待完善", description: "需要实现导出功能" },
    ],
  },
  {
    id: "content-advanced",
    name: "高级内容创作",
    description: "高级内容创作工具，包含质量评分、图文编辑和A/B测试",
    path: "/content-creator/advanced",
    icon: FileText,
    status: "完成",
    category: "内容",
    buttons: [
      { name: "内容质量评分按钮", status: "正常" },
      { name: "图文编辑器按钮", status: "正常" },
      { name: "A/B测试按钮", status: "正常" },
    ],
  },
  {
    id: "content-enhanced",
    name: "增强内容创作",
    description: "增强型内容创作工具，支持AI图片生成和历史记录",
    path: "/content-creator/enhanced",
    icon: ImageIcon,
    status: "完成",
    category: "内容",
    buttons: [
      { name: "添加文本按钮", status: "正常" },
      { name: "添加图片按钮", status: "正常" },
      { name: "添加图文按钮", status: "正常" },
      { name: "AI生成图片按钮", status: "正常" },
      { name: "撤销/重做按钮", status: "正常" },
      { name: "历史记录按钮", status: "正常" },
    ],
  },
  {
    id: "analytics",
    name: "数据分析",
    description: "数据分析工具，提供数据可视化和洞察",
    path: "/analytics",
    icon: LineChart,
    status: "计划中",
    category: "数据",
    buttons: [
      { name: "数据筛选按钮", status: "缺失", description: "需要实现" },
      { name: "导出报告按钮", status: "缺失", description: "需要实现" },
      { name: "数据刷新按钮", status: "缺失", description: "需要实现" },
    ],
  },
  {
    id: "learning",
    name: "学习中心",
    description: "学习资源中心，提供教程和指南",
    path: "/learning",
    icon: BookOpen,
    status: "计划中",
    category: "学习",
    buttons: [
      { name: "课程筛选按钮", status: "缺失", description: "需要实现" },
      { name: "收藏按钮", status: "缺失", description: "需要实现" },
      { name: "开始学习按钮", status: "缺失", description: "需要实现" },
    ],
  },
  {
    id: "ab-testing",
    name: "A/B测试",
    description: "内容A/B测试工具，比较不同版本效果",
    path: "/content-creator/advanced?tab=ab-testing",
    icon: TestTube2,
    status: "完成",
    category: "测试",
    buttons: [
      { name: "添加变体按钮", status: "正常" },
      { name: "AI生成变体按钮", status: "正常" },
      { name: "复制按钮", status: "待完善", description: "需要实现复制功能" },
      { name: "应用按钮", status: "待完善", description: "需要实现应用功能" },
    ],
  },
  {
    id: "image-text-editor",
    name: "图文编辑器",
    description: "图文混排编辑器，支持多种布局",
    path: "/content-creator/advanced?tab=image-text",
    icon: Layers,
    status: "完成",
    category: "内容",
    buttons: [
      { name: "添加文本按钮", status: "正常" },
      { name: "添加图片按钮", status: "正常" },
      { name: "添加图文按钮", status: "正常" },
      { name: "编辑/预览模式按钮", status: "正常" },
      { name: "布局按钮", status: "待完善", description: "功能尚未完全实现" },
    ],
  },
  {
    id: "ai-image-generator",
    name: "AI图片生成",
    description: "AI驱动的图片生成工具",
    path: "/content-creator/enhanced",
    icon: Sparkles,
    status: "完成",
    category: "AI",
    buttons: [
      { name: "生成图片按钮", status: "正常" },
      { name: "下载按钮", status: "待完善", description: "需要实现下载功能" },
      { name: "复制按钮", status: "待完善", description: "需要实现复制功能" },
    ],
  },
  {
    id: "content-quality",
    name: "内容质量评分",
    description: "AI评估内容质量并提供改进建议",
    path: "/content-creator/advanced?tab=quality",
    icon: CheckCircle2,
    status: "完成",
    category: "AI",
    buttons: [],
  },
  {
    id: "background-selector",
    name: "背景选择器",
    description: "自定义界面背景",
    path: "/background-demo",
    icon: Paintbrush,
    status: "完成",
    category: "UI",
    buttons: [
      { name: "选择背景按钮", status: "正常" },
      { name: "应用背景按钮", status: "正常" },
      { name: "取消按钮", status: "正常" },
    ],
  },
  {
    id: "history-tracking",
    name: "历史记录",
    description: "操作历史记录和撤销/重做功能",
    path: "/content-creator/enhanced",
    icon: History,
    status: "完成",
    category: "工具",
    buttons: [
      { name: "撤销按钮", status: "正常" },
      { name: "重做按钮", status: "正常" },
      { name: "查看历史记录按钮", status: "正常" },
    ],
  },
  {
    id: "responsive-navigation",
    name: "响应式导航",
    description: "适应不同设备的导航栏",
    path: "/",
    icon: Laptop,
    status: "完成",
    category: "UI",
    buttons: [
      { name: "菜单按钮", status: "正常" },
      { name: "搜索按钮", status: "正常" },
      { name: "通知按钮", status: "正常" },
      { name: "用户菜单按钮", status: "正常" },
    ],
  },
  {
    id: "ai-assistant",
    name: "AI助手",
    description: "智能AI助手，提供实时帮助",
    path: "/content-creator",
    icon: Brain,
    status: "完成",
    category: "AI",
    buttons: [
      { name: "发送按钮", status: "正常" },
      { name: "优化标题按钮", status: "待完善", description: "功能尚未完全实现" },
      { name: "生成关键词按钮", status: "待完善", description: "功能尚未完全实现" },
    ],
  },
  {
    id: "platform-selector",
    name: "平台选择器",
    description: "选择目标平台和内容类型",
    path: "/content-creator",
    icon: Zap,
    status: "完成",
    category: "工具",
    buttons: [
      { name: "平台选择按钮", status: "正常" },
      { name: "添加平台按钮", status: "待完善", description: "功能尚未实现" },
      { name: "内容类型下拉按钮", status: "待完善", description: "下拉功能尚未实现" },
    ],
  },
]

// 状态徽章颜色映射
const statusColors: Record<FeatureStatus, string> = {
  完成: "green",
  进行中: "blue",
  计划中: "orange",
  待审核: "purple",
}

// 按钮状态颜色映射
const buttonStatusColors: Record<string, string> = {
  正常: "bg-green-600/20 text-green-500 border-green-600/30",
  待完善: "bg-orange-600/20 text-orange-500 border-orange-600/30",
  缺失: "bg-red-600/20 text-red-500 border-red-600/30",
}

export default function SystemMapPage() {
  const pathname = usePathname()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // 过滤功能
  const filteredFeatures =
    selectedCategory === "all" ? features : features.filter((feature) => feature.category === selectedCategory)

  // 获取所有类别
  const categories = ["all", ...Array.from(new Set(features.map((f) => f.category)))]

  // 计算按钮状态统计
  const buttonStats = {
    total: features.reduce((acc, feature) => acc + (feature.buttons?.length || 0), 0),
    normal: features.reduce(
      (acc, feature) => acc + (feature.buttons?.filter((b) => b.status === "正常").length || 0),
      0,
    ),
    needsImprovement: features.reduce(
      (acc, feature) => acc + (feature.buttons?.filter((b) => b.status === "待完善").length || 0),
      0,
    ),
    missing: features.reduce(
      (acc, feature) => acc + (feature.buttons?.filter((b) => b.status === "缺失").length || 0),
      0,
    ),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-blue-950">
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">系统功能地图</h1>
            <p className="text-blue-300">查看所有核心功能和页面，审核按钮功能完善度</p>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">总功能数</p>
                    <p className="text-2xl font-bold text-white mt-1">{features.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-900/30 flex items-center justify-center">
                    <Layers className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">按钮总数</p>
                    <p className="text-2xl font-bold text-white mt-1">{buttonStats.total}</p>
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
                    <p className="text-sm text-slate-400">功能完成率</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {Math.round((features.filter((f) => f.status === "完成").length / features.length) * 100)}%
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">按钮完善率</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {buttonStats.total ? Math.round((buttonStats.normal / buttonStats.total) * 100) : 0}%
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-900/30 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 按钮状态详情 */}
          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">按钮功能状态</CardTitle>
              <CardDescription className="text-slate-400">所有功能按钮的完善状态概览</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-900/20 border border-green-900/30">
                  <div className="h-10 w-10 rounded-full bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-400">正常</p>
                    <p className="text-xl font-bold text-white">{buttonStats.normal}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-900/20 border border-orange-900/30">
                  <div className="h-10 w-10 rounded-full bg-orange-900/30 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-400">待完善</p>
                    <p className="text-xl font-bold text-white">{buttonStats.needsImprovement}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-red-900/20 border border-red-900/30">
                  <div className="h-10 w-10 rounded-full bg-red-900/30 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-400">缺失</p>
                    <p className="text-xl font-bold text-white">{buttonStats.missing}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 功能列表 */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
                <TabsList className="bg-slate-800/50 border border-slate-700 w-full sm:w-auto">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white capitalize"
                    >
                      {category === "all" ? "全部" : category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "border-slate-700 bg-slate-800/50 hover:bg-slate-800",
                    viewMode === "grid" ? "text-white" : "text-slate-400",
                  )}
                  onClick={() => setViewMode("grid")}
                >
                  <Laptop className="h-4 w-4 mr-1" />
                  网格视图
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "border-slate-700 bg-slate-800/50 hover:bg-slate-800",
                    viewMode === "list" ? "text-white" : "text-slate-400",
                  )}
                  onClick={() => setViewMode("list")}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  列表视图
                </Button>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFeatures.map((feature) => (
                  <Card
                    key={feature.id}
                    className={cn(
                      "bg-slate-900/60 border-slate-800 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg",
                      pathname === feature.path && "border-blue-600/50 shadow-blue-900/20",
                    )}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant={statusColors[feature.status] as any} className="mb-2">
                          {feature.status}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-800/50 text-slate-400">
                          {feature.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <feature.icon className="h-5 w-5 text-blue-400" />
                        {feature.name}
                      </CardTitle>
                      <CardDescription className="text-slate-400">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {feature.buttons && feature.buttons.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-slate-500">按钮状态</p>
                          <div className="flex flex-wrap gap-2">
                            {feature.buttons.map((button, idx) => (
                              <div
                                key={idx}
                                className={cn("text-xs px-2 py-1 rounded-md border", buttonStatusColors[button.status])}
                                title={button.description}
                              >
                                {button.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">无按钮组件</p>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                        asChild
                      >
                        <Link href={feature.path}>
                          <ArrowRight className="h-4 w-4 mr-1" />
                          访问页面
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg bg-slate-900/60 border border-slate-800 backdrop-blur-sm",
                      pathname === feature.path && "border-blue-600/50",
                    )}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-1">
                        <Badge variant={statusColors[feature.status] as any} className="text-[10px]">
                          {feature.status}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-800/50 text-slate-400 text-[10px]">
                          {feature.category}
                        </Badge>
                      </div>
                      <h3 className="text-sm font-medium text-white">{feature.name}</h3>
                      <p className="text-xs text-slate-400">{feature.description}</p>

                      {feature.buttons && feature.buttons.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {feature.buttons.map((button, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-md border",
                                buttonStatusColors[button.status],
                              )}
                              title={button.description}
                            >
                              {button.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="sm:self-center text-slate-400 hover:text-white"
                      asChild
                    >
                      <Link href={feature.path}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        访问
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 按钮功能改进建议 */}
          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">按钮功能改进建议</CardTitle>
              <CardDescription className="text-slate-400">基于审核结果的功能改进建议</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white">高优先级</h3>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>实现内容创作页面的保存和导出功能</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>完善A/B测试的复制和应用功能</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>实现AI图片生成的下载和复制功能</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white">中优先级</h3>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>完善智能优化功能的实际操作逻辑</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>实现图文编辑器的布局功能</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>完善平台选择器的添加平台和内容类型下拉功能</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white">低优先级</h3>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>实现AI助手的优化标题和生成关键词功能</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>添加数据分析页面的基础功能和按钮</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>开发学习中心页面的基础功能和按钮</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
