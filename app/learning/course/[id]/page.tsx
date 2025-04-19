"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Clock,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
  CheckCircle,
  Bookmark,
  Share2,
  MessageSquare,
  FileText,
  ListChecks,
  Award,
  Download,
} from "lucide-react"
import { PageTransition } from "@/components/page-transition"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { learningProgress } from "@/lib/supabase"

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
  instructor: {
    name: string
    title: string
    avatar: string
  }
  coverImage: string
  tags: string[]
  chapters: Chapter[]
  requirements: string[]
  objectives: string[]
  isBookmarked: boolean
}

// 章节类型
type Chapter = {
  id: string
  title: string
  duration: string
  videoUrl?: string
  description: string
  isCompleted?: boolean
  resources?: {
    title: string
    type: "pdf" | "video" | "link" | "exercise"
    url: string
  }[]
}

// 模拟课程数据
const coursesData: Record<string, Course> = {
  "1": {
    id: "1",
    title: "电商爆款文案写作技巧",
    description:
      "学习如何撰写吸引人的电商产品描述，提高转化率和销售额。本课程将教您如何分析目标受众，挖掘产品卖点，运用心理学原理，创作能够触动用户并促使其采取行动的文案。通过大量实例分析和实战练习，帮助您掌握电商文案创作的核心技巧。",
    category: "电商",
    level: "初级",
    duration: "2小时30分钟",
    rating: 4.8,
    students: 1245,
    instructor: {
      name: "李明",
      title: "资深电商文案专家",
      avatar: "/placeholder.svg?height=100&width=100&text=李明",
    },
    coverImage: "/placeholder.svg?height=400&width=800&text=电商文案",
    tags: ["文案写作", "电商", "转化率优化"],
    chapters: [
      {
        id: "1-1",
        title: "电商文案基础与心理学原理",
        duration: "30分钟",
        videoUrl: "#",
        description: "了解电商文案的基本结构和心理学原理，学习如何抓住用户注意力。",
        isCompleted: true,
        resources: [
          { title: "电商文案心理学指南", type: "pdf", url: "#" },
          { title: "案例分析：成功的电商文案", type: "video", url: "#" },
        ],
      },
      {
        id: "1-2",
        title: "产品卖点挖掘与表达",
        duration: "35分钟",
        videoUrl: "#",
        description: "学习如何发现产品的独特卖点，并用吸引人的方式表达出来。",
        isCompleted: true,
        resources: [
          { title: "卖点挖掘工作表", type: "pdf", url: "#" },
          { title: "卖点表达练习", type: "exercise", url: "#" },
        ],
      },
      {
        id: "1-3",
        title: "标题与开场的艺术",
        duration: "25分钟",
        videoUrl: "#",
        description: "掌握如何创作吸引眼球的标题和开场白，提高用户点击率。",
        isCompleted: false,
        resources: [
          { title: "高转化标题模板", type: "pdf", url: "#" },
          { title: "标题创作练习", type: "exercise", url: "#" },
        ],
      },
      {
        id: "1-4",
        title: "产品描述与情感诉求",
        duration: "40分钟",
        videoUrl: "#",
        description: "学习如何详细描述产品特性，并结合情感诉求增强说服力。",
        isCompleted: false,
        resources: [
          { title: "情感诉求词汇表", type: "pdf", url: "#" },
          { title: "产品描述案例分析", type: "video", url: "#" },
        ],
      },
      {
        id: "1-5",
        title: "行动召唤与紧迫感创造",
        duration: "20分钟",
        videoUrl: "#",
        description: "掌握如何设计有效的行动召唤和创造购买紧迫感。",
        isCompleted: false,
        resources: [
          { title: "行动召唤优化指南", type: "pdf", url: "#" },
          { title: "紧迫感案例分析", type: "video", url: "#" },
        ],
      },
    ],
    requirements: ["基本的文字表达能力", "对电商平台有基本了解", "有产品销售或营销经验更佳"],
    objectives: [
      "掌握电商文案的基本结构和写作技巧",
      "学会分析目标受众和挖掘产品卖点",
      "能够创作吸引人的标题和产品描述",
      "掌握情感诉求和行动召唤的运用",
      "提高文案的转化率和销售效果",
    ],
    isBookmarked: true,
  },
  // 可以添加更多课程...
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [activeTab, setActiveTab] = useState("content")
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 加载课程数据
  useEffect(() => {
    const courseId = params.id as string

    // 模拟API请求
    setTimeout(() => {
      const courseData = coursesData[courseId]
      if (courseData) {
        setCourse(courseData)
        setIsBookmarked(courseData.isBookmarked)

        // 计算进度
        if (courseData.chapters) {
          const completedChapters = courseData.chapters.filter((chapter) => chapter.isCompleted).length
          const totalChapters = courseData.chapters.length
          setProgress(Math.round((completedChapters / totalChapters) * 100))

          // 找到第一个未完成的章节
          const firstIncompleteIndex = courseData.chapters.findIndex((chapter) => !chapter.isCompleted)
          if (firstIncompleteIndex !== -1) {
            setCurrentChapterIndex(firstIncompleteIndex)
          }
        }
      } else {
        toast({
          title: "课程不存在",
          description: "无法找到该课程，请返回课程列表",
          variant: "destructive",
        })
        router.push("/learning")
      }
      setIsLoading(false)
    }, 1000)
  }, [params.id, router, toast])

  // 如果用户已登录，从数据库加载进度
  useEffect(() => {
    if (user && params.id) {
      const loadProgress = async () => {
        try {
          const { data, error } = await learningProgress.getCourseProgress(user.id, params.id as string)
          if (data && !error) {
            setProgress(data.progress)

            // 更新章节完成状态
            if (course) {
              const updatedChapters = course.chapters.map((chapter, index) => ({
                ...chapter,
                isCompleted: ((index + 1) / course.chapters.length) * 100 <= data.progress,
              }))
              setCourse({
                ...course,
                chapters: updatedChapters,
              })
            }
          }
        } catch (error) {
          console.error("Error loading progress:", error)
        }
      }

      loadProgress()
    }
  }, [user, params.id, course])

  // 切换章节
  const handleChapterChange = (index: number) => {
    if (course && index >= 0 && index < course.chapters.length) {
      setCurrentChapterIndex(index)
      setIsPlaying(false)
    }
  }

  // 切换播放状态
  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying)
  }

  // 完成当前章节
  const handleCompleteChapter = async () => {
    if (!course) return

    const updatedChapters = [...course.chapters]
    updatedChapters[currentChapterIndex] = {
      ...updatedChapters[currentChapterIndex],
      isCompleted: true,
    }

    // 计算新进度
    const completedChapters = updatedChapters.filter((chapter) => chapter.isCompleted).length
    const totalChapters = updatedChapters.length
    const newProgress = Math.round((completedChapters / totalChapters) * 100)

    setCourse({
      ...course,
      chapters: updatedChapters,
    })
    setProgress(newProgress)

    // 如果用户已登录，保存进度到数据库
    if (user) {
      try {
        await learningProgress.updateCourseProgress(user.id, course.id, newProgress, newProgress === 100)

        toast({
          title: "进度已保存",
          description: newProgress === 100 ? "恭喜！您已完成本课程" : "章节完成，进度已更新",
        })
      } catch (error) {
        console.error("Error saving progress:", error)
        toast({
          title: "保存失败",
          description: "无法保存学习进度，请稍后再试",
          variant: "destructive",
        })
      }
    }

    // 自动进入下一章节
    if (currentChapterIndex < course.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1)
    }
  }

  // 切换收藏状态
  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked)

    toast({
      title: isBookmarked ? "已取消收藏" : "已加入收藏",
      description: isBookmarked ? "课程已从收藏夹中移除" : "课程已添加到收藏夹",
    })
  }

  if (isLoading || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-blue-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-blue-900/50 flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-400 opacity-50" />
          </div>
          <div className="h-6 w-48 bg-slate-800 rounded mb-2"></div>
          <div className="h-4 w-32 bg-slate-800 rounded"></div>
        </div>
      </div>
    )
  }

  const currentChapter = course.chapters[currentChapterIndex]

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-blue-950">
        <main className="container mx-auto py-8 px-4">
          <div className="flex flex-col gap-6">
            {/* 返回按钮 */}
            <Button
              variant="ghost"
              className="w-fit text-slate-400 hover:text-white"
              onClick={() => router.push("/learning")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回课程列表
            </Button>

            {/* 课程头部信息 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm overflow-hidden">
                  <div className="relative">
                    <img
                      src={course.coverImage || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 md:h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-70"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline" className="bg-slate-800/70 text-slate-300 border-slate-700">
                          {course.category}
                        </Badge>
                        <Badge className="bg-blue-600 text-white">{course.level}</Badge>
                      </div>
                      <h1 className="text-2xl md:text-3xl font-bold text-white">{course.title}</h1>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-400">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        {course.rating} 分
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.students} 名学员
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-slate-700 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="ml-2">{progress}%</span>
                      </div>
                    </div>
                    <p className="text-slate-300">{course.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white"
                      onClick={() => {
                        setActiveTab("content")
                        handlePlayToggle()
                      }}
                    >
                      {progress > 0 ? "继续学习" : "开始学习"}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                      onClick={handleBookmarkToggle}
                    >
                      <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-yellow-500 text-yellow-500" : ""}`} />
                      {isBookmarked ? "已收藏" : "收藏"}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      分享
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* 讲师信息 */}
              <div>
                <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">讲师信息</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <img
                        src={course.instructor.avatar || "/placeholder.svg"}
                        alt={course.instructor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-white">{course.instructor.name}</h3>
                        <p className="text-sm text-slate-400">{course.instructor.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 课程标签 */}
                <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white">课程标签</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 课程资源 */}
                <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white">课程资源</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        课程讲义
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        练习文件
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 课程内容标签页 */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-slate-800/50 border border-slate-700 w-full">
                <TabsTrigger value="content" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  课程内容
                </TabsTrigger>
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  课程概览
                </TabsTrigger>
                <TabsTrigger
                  value="discussion"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  讨论区
                </TabsTrigger>
              </TabsList>

              {/* 课程内容 */}
              <TabsContent value="content" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white">{currentChapter.title}</CardTitle>
                            <CardDescription className="text-slate-400">{currentChapter.duration}</CardDescription>
                          </div>
                          <Badge
                            className={
                              currentChapter.isCompleted ? "bg-green-600 text-white" : "bg-blue-600 text-white"
                            }
                          >
                            {currentChapter.isCompleted ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                已完成
                              </>
                            ) : (
                              "学习中"
                            )}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* 视频播放区域 */}
                        <div className="relative aspect-video bg-slate-800 rounded-lg mb-4 flex items-center justify-center">
                          <div className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-16 w-16 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300"
                              onClick={handlePlayToggle}
                            >
                              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                            </Button>
                            {isPlaying && <p className="mt-2 text-slate-400">正在播放...</p>}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-white">章节描述</h3>
                          <p className="text-slate-300">{currentChapter.description}</p>

                          {currentChapter.resources && currentChapter.resources.length > 0 && (
                            <div className="mt-4">
                              <h3 className="text-lg font-medium text-white mb-2">章节资源</h3>
                              <div className="space-y-2">
                                {currentChapter.resources.map((resource) => (
                                  <Button
                                    key={resource.title}
                                    variant="outline"
                                    className="w-full justify-start border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                                  >
                                    {resource.type === "pdf" && <FileText className="h-4 w-4 mr-2" />}
                                    {resource.type === "video" && <Play className="h-4 w-4 mr-2" />}
                                    {resource.type === "exercise" && <ListChecks className="h-4 w-4 mr-2" />}
                                    {resource.type === "link" && <Share2 className="h-4 w-4 mr-2" />}
                                    {resource.title}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between mt-6">
                            <Button
                              variant="outline"
                              className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                              onClick={() => handleChapterChange(currentChapterIndex - 1)}
                              disabled={currentChapterIndex === 0}
                            >
                              <ChevronLeft className="h-4 w-4 mr-2" />
                              上一章
                            </Button>
                            <Button
                              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white"
                              onClick={handleCompleteChapter}
                              disabled={currentChapter.isCompleted}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {currentChapter.isCompleted ? "已完成" : "标记为已完成"}
                            </Button>
                            <Button
                              variant="outline"
                              className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                              onClick={() => handleChapterChange(currentChapterIndex + 1)}
                              disabled={currentChapterIndex === course.chapters.length - 1}
                            >
                              下一章
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 章节列表 */}
                  <div>
                    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white">课程章节</CardTitle>
                        <CardDescription className="text-slate-400">
                          总计 {course.chapters.length} 个章节，{course.duration}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {course.chapters.map((chapter, index) => (
                            <div
                              key={chapter.id}
                              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                currentChapterIndex === index
                                  ? "bg-blue-900/30 border border-blue-800"
                                  : "border border-slate-800 hover:bg-slate-800/50"
                              }`}
                              onClick={() => handleChapterChange(index)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                      chapter.isCompleted
                                        ? "bg-green-600/20 text-green-500"
                                        : currentChapterIndex === index
                                          ? "bg-blue-600/20 text-blue-500"
                                          : "bg-slate-800 text-slate-500"
                                    }`}
                                  >
                                    {chapter.isCompleted ? (
                                      <CheckCircle className="h-4 w-4" />
                                    ) : (
                                      <span>{index + 1}</span>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-white">{chapter.title}</h4>
                                    <p className="text-xs text-slate-400">{chapter.duration}</p>
                                  </div>
                                </div>
                                {chapter.isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* 课程概览 */}
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white">课程目标</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {course.objectives.map((objective, index) => (
                            <li key={index} className="flex items-start gap-2 text-slate-300">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm mt-6">
                      <CardHeader>
                        <CardTitle className="text-white">课程要求</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {course.requirements.map((requirement, index) => (
                            <li key={index} className="flex items-start gap-2 text-slate-300">
                              <div className="h-5 w-5 rounded-full bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs text-blue-500">{index + 1}</span>
                              </div>
                              <span>{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white">学习进度</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-400">完成进度</span>
                              <span className="text-white">{progress}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5">
                              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-3">
                              <Award className="h-5 w-5 text-yellow-500" />
                              <div>
                                <h4 className="text-sm font-medium text-white">课程证书</h4>
                                <p className="text-xs text-slate-400">完成课程后获得</p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                              disabled={progress < 100}
                            >
                              {progress < 100 ? "未解锁" : "查看证书"}
                            </Button>
                          </div>

                          <div className="pt-2">
                            <h4 className="text-sm font-medium text-white mb-2">推荐后续课程</h4>
                            <div className="space-y-2">
                              <div className="p-3 rounded-lg border border-slate-800 hover:bg-slate-800/50 cursor-pointer">
                                <h5 className="text-sm font-medium text-white">电商平台SEO优化指南</h5>
                                <p className="text-xs text-slate-400">提高搜索排名和自然流量</p>
                              </div>
                              <div className="p-3 rounded-lg border border-slate-800 hover:bg-slate-800/50 cursor-pointer">
                                <h5 className="text-sm font-medium text-white">数据驱动的内容优化策略</h5>
                                <p className="text-xs text-slate-400">提高内容表现和ROI</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* 讨论区 */}
              <TabsContent value="discussion" className="mt-6">
                <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">课程讨论</CardTitle>
                    <CardDescription className="text-slate-400">与其他学员交流学习心得和问题</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center p-8">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">讨论功能即将上线</h3>
                        <p className="text-slate-400 max-w-md">
                          我们正在开发讨论功能，敬请期待。您将能够与其他学员和讲师交流学习心得和问题。
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
