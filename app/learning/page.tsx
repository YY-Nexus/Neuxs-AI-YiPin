"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Search,
  Filter,
  Star,
  Clock,
  Play,
  Bookmark,
  CheckCircle,
  Award,
  TrendingUp,
  Zap,
  Lightbulb,
  Users,
  BarChart,
  ShoppingBag,
} from "lucide-react"
import { PageTransition } from "@/components/page-transition"

// 课程类型
type Course = {
  id: string
  title: string
  description: string
  category: string
  level: "初级" | "中级" | "高级"
  duration: string
  rating: number
  students: number
  isFeatured: boolean
  isNew: boolean
  isBookmarked: boolean
  isCompleted: boolean
  progress?: number
  image: string
  tags: string[]
}

// 模拟课程数据
const courses: Course[] = [
  {
    id: "1",
    title: "电商爆款文案写作技巧",
    description: "学习如何撰写吸引人的电商产品描述，提高转化率和销售额。",
    category: "电商",
    level: "初级",
    duration: "2小时30分钟",
    rating: 4.8,
    students: 1245,
    isFeatured: true,
    isNew: false,
    isBookmarked: true,
    isCompleted: false,
    progress: 35,
    image: "/placeholder.svg?height=200&width=300&text=电商文案",
    tags: ["文案写作", "电商", "转化率优化"],
  },
  {
    id: "2",
    title: "短视频脚本创作与优化",
    description: "掌握短视频脚本创作的核心技巧，提高内容吸引力和传播力。",
    category: "短视频",
    level: "中级",
    duration: "3小时15分钟",
    rating: 4.6,
    students: 982,
    isFeatured: false,
    isNew: true,
    isBookmarked: false,
    isCompleted: false,
    image: "/placeholder.svg?height=200&width=300&text=短视频脚本",
    tags: ["短视频", "脚本创作", "内容策划"],
  },
  {
    id: "3",
    title: "社交媒体内容策划与运营",
    description: "学习如何策划和运营社交媒体内容，提高粉丝互动和品牌影响力。",
    category: "社媒",
    level: "中级",
    duration: "4小时",
    rating: 4.7,
    students: 1568,
    isFeatured: true,
    isNew: false,
    isBookmarked: false,
    isCompleted: true,
    image: "/placeholder.svg?height=200&width=300&text=社媒运营",
    tags: ["社交媒体", "内容策划", "粉丝运营"],
  },
  {
    id: "4",
    title: "AI辅助内容创作实战",
    description: "学习如何利用AI工具辅助内容创作，提高创作效率和内容质量。",
    category: "AI",
    level: "初级",
    duration: "2小时45分钟",
    rating: 4.9,
    students: 2103,
    isFeatured: true,
    isNew: true,
    isBookmarked: true,
    isCompleted: false,
    progress: 15,
    image: "/placeholder.svg?height=200&width=300&text=AI内容创作",
    tags: ["AI", "内容创作", "效率提升"],
  },
  {
    id: "5",
    title: "数据驱动的内容优化策略",
    description: "学习如何利用数据分析优化内容策略，提高内容表现和ROI。",
    category: "数据",
    level: "高级",
    duration: "5小时30分钟",
    rating: 4.5,
    students: 876,
    isFeatured: false,
    isNew: false,
    isBookmarked: false,
    isCompleted: false,
    image: "/placeholder.svg?height=200&width=300&text=数据内容优化",
    tags: ["数据分析", "内容优化", "ROI"],
  },
  {
    id: "6",
    title: "电商平台SEO优化指南",
    description: "学习如何优化电商平台内容，提高搜索排名和自然流量。",
    category: "电商",
    level: "中级",
    duration: "3小时45分钟",
    rating: 4.7,
    students: 1342,
    isFeatured: false,
    isNew: false,
    isBookmarked: false,
    isCompleted: false,
    image: "/placeholder.svg?height=200&width=300&text=电商SEO",
    tags: ["SEO", "电商", "流量优化"],
  },
]

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>(
    courses.filter((course) => course.isBookmarked).map((course) => course.id),
  )

  // 过滤课程
  const filteredCourses = courses.filter((course) => {
    // 根据标签过滤
    if (activeTab !== "all" && activeTab !== "bookmarked" && activeTab !== "completed") {
      if (!course.tags.includes(activeTab)) {
        return false
      }
    }

    // 收藏过滤
    if (activeTab === "bookmarked" && !bookmarkedCourses.includes(course.id)) {
      return false
    }

    // 已完成过滤
    if (activeTab === "completed" && !course.isCompleted) {
      return false
    }

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return true
  })

  // 切换收藏状态
  const toggleBookmark = (courseId: string) => {
    if (bookmarkedCourses.includes(courseId)) {
      setBookmarkedCourses(bookmarkedCourses.filter((id) => id !== courseId))
    } else {
      setBookmarkedCourses([...bookmarkedCourses, courseId])
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-blue-950">
        <main className="container mx-auto py-8 px-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">学习中心</h1>
              <p className="text-blue-300">探索专业课程，提升您的内容创作和运营能力</p>
            </div>

            {/* 搜索和筛选 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="搜索课程..."
                  className="pl-9 border-slate-700 bg-slate-800/50 text-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="h-10 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
              >
                <Filter className="h-4 w-4 mr-2" />
                高级筛选
              </Button>
            </div>

            {/* 课程分类标签 */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-slate-800/50 border border-slate-700 w-full flex flex-wrap h-auto py-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white h-8">
                  全部课程
                </TabsTrigger>
                <TabsTrigger
                  value="文案写作"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white h-8"
                >
                  文案写作
                </TabsTrigger>
                <TabsTrigger
                  value="内容策划"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white h-8"
                >
                  内容策划
                </TabsTrigger>
                <TabsTrigger
                  value="电商"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white h-8"
                >
                  电商
                </TabsTrigger>
                <TabsTrigger value="AI" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white h-8">
                  AI工具
                </TabsTrigger>
                <TabsTrigger
                  value="bookmarked"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white h-8"
                >
                  我的收藏
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white h-8"
                >
                  已完成
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* 推荐课程 */}
            {activeTab === "all" && !searchQuery && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">推荐课程</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses
                    .filter((course) => course.isFeatured)
                    .map((course) => (
                      <Card
                        key={course.id}
                        className="bg-slate-900/60 border-slate-800 backdrop-blur-sm overflow-hidden flex flex-col"
                      >
                        <div className="relative">
                          <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute top-2 right-2 flex gap-1">
                            {course.isNew && (
                              <Badge className="bg-blue-600 text-white">
                                <Zap className="h-3 w-3 mr-1" />
                                新课
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-slate-900/70 text-slate-200 hover:text-white hover:bg-slate-900/90"
                              onClick={() => toggleBookmark(course.id)}
                            >
                              <Bookmark
                                className={`h-4 w-4 ${
                                  bookmarkedCourses.includes(course.id) ? "fill-yellow-500 text-yellow-500" : ""
                                }`}
                              />
                            </Button>
                          </div>
                          {course.progress !== undefined && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                              <div className="h-full bg-blue-600" style={{ width: `${course.progress}%` }}></div>
                            </div>
                          )}
                        </div>
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className="bg-slate-800/50 text-slate-400 border-slate-700">
                              {course.category}
                            </Badge>
                            <div className="flex items-center text-yellow-500">
                              <Star className="h-3 w-3 fill-yellow-500" />
                              <span className="text-xs ml-1">{course.rating}</span>
                            </div>
                          </div>
                          <CardTitle className="text-lg text-white mt-2">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 flex-1">
                          <p className="text-sm text-slate-400 line-clamp-2">{course.description}</p>
                          <div className="flex items-center mt-3 text-xs text-slate-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{course.duration}</span>
                            <span className="mx-2">•</span>
                            <span>{course.level}</span>
                            <span className="mx-2">•</span>
                            <Users className="h-3 w-3 mr-1" />
                            <span>{course.students}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white">
                            <Play className="h-4 w-4 mr-2" />
                            {course.progress !== undefined ? "继续学习" : "开始学习"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* 课程列表 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {activeTab === "all"
                    ? "所有课程"
                    : activeTab === "bookmarked"
                      ? "我的收藏"
                      : activeTab === "completed"
                        ? "已完成课程"
                        : `${activeTab}相关课程`}
                </h2>
                <span className="text-sm text-slate-400">{filteredCourses.length} 个课程</span>
              </div>

              {filteredCourses.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">暂无相关课程</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    没有找到符合当前筛选条件的课程，请尝试调整搜索关键词或筛选条件。
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="bg-slate-900/60 border-slate-800 backdrop-blur-sm overflow-hidden flex flex-col"
                    >
                      <div className="relative">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          {course.isNew && (
                            <Badge className="bg-blue-600 text-white">
                              <Zap className="h-3 w-3 mr-1" />
                              新课
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-slate-900/70 text-slate-200 hover:text-white hover:bg-slate-900/90"
                            onClick={() => toggleBookmark(course.id)}
                          >
                            <Bookmark
                              className={`h-4 w-4 ${
                                bookmarkedCourses.includes(course.id) ? "fill-yellow-500 text-yellow-500" : ""
                              }`}
                            />
                          </Button>
                        </div>
                        {course.progress !== undefined && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                            <div className="h-full bg-blue-600" style={{ width: `${course.progress}%` }}></div>
                          </div>
                        )}
                        {course.isCompleted && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              已完成
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline" className="bg-slate-800/50 text-slate-400 border-slate-700">
                            {course.category}
                          </Badge>
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-3 w-3 fill-yellow-500" />
                            <span className="text-xs ml-1">{course.rating}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg text-white mt-2">{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 flex-1">
                        <p className="text-sm text-slate-400 line-clamp-2">{course.description}</p>
                        <div className="flex items-center mt-3 text-xs text-slate-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{course.duration}</span>
                          <span className="mx-2">•</span>
                          <span>{course.level}</span>
                          <span className="mx-2">•</span>
                          <Users className="h-3 w-3 mr-1" />
                          <span>{course.students}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white">
                          <Play className="h-4 w-4 mr-2" />
                          {course.isCompleted ? "重新学习" : course.progress !== undefined ? "继续学习" : "开始学习"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* 学习路径 */}
            <div className="space-y-4 mt-8">
              <h2 className="text-xl font-bold text-white">推荐学习路径</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-white">电商内容创作专家</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400 mb-4">
                      掌握电商平台内容创作的核心技能，从文案写作到数据分析，成为电商内容创作专家。
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-slate-300">5门核心课程</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-slate-300">预计学习时间：15小时</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-slate-300">1,245人正在学习</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white">
                      查看路径
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-white">短视频内容运营</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400 mb-4">
                      学习短视频内容策划、脚本创作和数据分析，打造爆款短视频内容，提升账号影响力。
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-slate-300">4门核心课程</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-slate-300">预计学习时间：12小时</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-slate-300">982人正在学习</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white">
                      查看路径
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                        <BarChart className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-white">数据驱动内容优化</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400 mb-4">
                      学习如何利用数据分析优化内容策略，提高内容表现和ROI，实现精准内容营销。
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-slate-300">6门核心课程</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-slate-300">预计学习时间：20小时</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-slate-300">768人正在学习</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white">
                      查看路径
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
