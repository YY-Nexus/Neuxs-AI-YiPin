import { supabase } from "./supabase"

// 示例用户ID - 在实际应用中，这将是已登录用户的ID
// 注意：这只是用于演示，实际应用中应该使用真实的用户ID
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000"

// 添加示例内容
export async function seedContents() {
  const { error } = await supabase.from("contents").insert([
    {
      user_id: DEMO_USER_ID,
      title: "轻奢真丝几何剪裁连衣裙",
      keywords: "真丝,连衣裙,几何剪裁,优雅,高级感",
      content:
        "这款新品连衣裙采用高级真丝面料，触感柔滑，穿着舒适。独特的几何剪裁设计，勾勒出完美曲线，尽显优雅气质。多种场合百搭，从商务会议到晚宴约会，都能轻松驾驭。限时优惠，原价¥599，现在购买仅需¥399！更有多色可选，赶紧下单，穿出专属于你的时尚态度！",
      metadata: {
        creativityLevel: 70,
        platform: "taobao",
        contentType: "product",
      },
    },
    {
      user_id: DEMO_USER_ID,
      title: "轻薄透气运动鞋",
      keywords: "运动鞋,轻薄,透气,舒适,运动",
      content:
        "全新升级的轻薄透气运动鞋，采用创新网眼织物，提供卓越的透气性能。特殊减震鞋底，缓解运动冲击，保护关节健康。人体工学设计，贴合脚型，带来全天候的舒适体验。无论是日常健身还是户外跑步，都能满足您的需求。多种配色可选，展现您的运动活力！",
      metadata: {
        creativityLevel: 65,
        platform: "jd",
        contentType: "product",
      },
    },
  ])

  if (error) {
    console.error("Error seeding contents:", error)
    return false
  }
  return true
}

// 添加示例课程进度
export async function seedCourseProgress() {
  const { error } = await supabase.from("course_progress").insert([
    {
      user_id: DEMO_USER_ID,
      course_id: "1",
      progress: 35,
      completed: false,
    },
    {
      user_id: DEMO_USER_ID,
      course_id: "3",
      progress: 100,
      completed: true,
    },
  ])

  if (error) {
    console.error("Error seeding course progress:", error)
    return false
  }
  return true
}

// 添加示例分析数据
export async function seedAnalyticsData() {
  // 生成过去30天的数据
  const entries = []
  const now = new Date()

  for (let i = 0; i < 30; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    // 内容浏览数据
    entries.push({
      user_id: DEMO_USER_ID,
      type: "content_views",
      date: dateStr,
      data: {
        views: Math.floor(Math.random() * 100) + 50,
        unique_visitors: Math.floor(Math.random() * 50) + 20,
        avg_time_on_page: Math.floor(Math.random() * 120) + 60,
      },
    })

    // 转化数据
    entries.push({
      user_id: DEMO_USER_ID,
      type: "conversions",
      date: dateStr,
      data: {
        clicks: Math.floor(Math.random() * 40) + 10,
        conversions: Math.floor(Math.random() * 10) + 1,
        revenue: Math.floor(Math.random() * 1000) + 200,
      },
    })
  }

  const { error } = await supabase.from("analytics_data").insert(entries)

  if (error) {
    console.error("Error seeding analytics data:", error)
    return false
  }
  return true
}

// 添加示例图片历史
export async function seedImageHistory() {
  const { error } = await supabase.from("image_history").insert([
    {
      user_id: DEMO_USER_ID,
      prompt: "轻奢真丝连衣裙产品展示，高级感，简约背景",
      negative_prompt: "低质量，模糊，变形",
      image_url: "/placeholder.svg?height=512&width=512&text=真丝连衣裙",
      style: "realistic",
      params: {
        styleStrength: 70,
        promptStrength: 80,
        seed: "12345678",
        realism: 0.9,
        detailLevel: 0.8,
      },
    },
    {
      user_id: DEMO_USER_ID,
      prompt: "运动鞋特写，展示材质和细节，白色背景",
      negative_prompt: "人物，模糊",
      image_url: "/placeholder.svg?height=512&width=512&text=运动鞋",
      style: "ecommerce",
      params: {
        styleStrength: 65,
        promptStrength: 75,
        seed: "87654321",
        clarity: 0.9,
        lighting: 0.8,
      },
    },
  ])

  if (error) {
    console.error("Error seeding image history:", error)
    return false
  }
  return true
}

// 添加示例收藏
export async function seedBookmarks() {
  const { error } = await supabase.from("bookmarks").insert([
    {
      user_id: DEMO_USER_ID,
      item_type: "course",
      item_id: "1",
    },
    {
      user_id: DEMO_USER_ID,
      item_type: "content",
      item_id: "1", // 假设这是内容的ID
    },
  ])

  if (error) {
    console.error("Error seeding bookmarks:", error)
    return false
  }
  return true
}

// 添加用户偏好设置
export async function seedUserPreferences() {
  const { error } = await supabase.from("user_preferences").insert([
    {
      user_id: DEMO_USER_ID,
      preferences: {
        theme: "dark",
        defaultPlatform: "taobao",
        defaultContentType: "product",
        defaultImageStyle: "realistic",
        notifications: {
          email: true,
          push: false,
        },
      },
    },
  ])

  if (error) {
    console.error("Error seeding user preferences:", error)
    return false
  }
  return true
}

// 执行所有种子数据函数
export async function seedAllData() {
  console.log("开始添加示例数据...")

  const contentsResult = await seedContents()
  console.log("内容数据添加" + (contentsResult ? "成功" : "失败"))

  const courseProgressResult = await seedCourseProgress()
  console.log("课程进度数据添加" + (courseProgressResult ? "成功" : "失败"))

  const analyticsDataResult = await seedAnalyticsData()
  console.log("分析数据添加" + (analyticsDataResult ? "成功" : "失败"))

  const imageHistoryResult = await seedImageHistory()
  console.log("图片历史数据添加" + (imageHistoryResult ? "成功" : "失败"))

  const bookmarksResult = await seedBookmarks()
  console.log("收藏数据添加" + (bookmarksResult ? "成功" : "失败"))

  const userPreferencesResult = await seedUserPreferences()
  console.log("用户偏好设置数据添加" + (userPreferencesResult ? "成功" : "失败"))

  return (
    contentsResult &&
    courseProgressResult &&
    analyticsDataResult &&
    imageHistoryResult &&
    bookmarksResult &&
    userPreferencesResult
  )
}
