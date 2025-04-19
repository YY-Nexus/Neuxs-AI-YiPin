import { createClient } from "@supabase/supabase-js"

// 环境变量应该在.env.local文件中设置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 用户相关操作
export const auth = {
  // 注册新用户
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  // 用户登录
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // 用户登出
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // 获取当前用户
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser()
    return { user: data.user, error }
  },

  // 获取会话
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession()
    return { session: data.session, error }
  },
}

// 内容相关操作
export const contentService = {
  // 保存内容
  saveContent: async (content: any) => {
    const { data, error } = await supabase.from("contents").insert([content]).select()
    return { data, error }
  },

  // 获取用户的所有内容
  getUserContents: async (userId: string) => {
    const { data, error } = await supabase
      .from("contents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    return { data, error }
  },

  // 获取单个内容
  getContent: async (contentId: string) => {
    const { data, error } = await supabase.from("contents").select("*").eq("id", contentId).single()
    return { data, error }
  },

  // 更新内容
  updateContent: async (contentId: string, updates: any) => {
    const { data, error } = await supabase.from("contents").update(updates).eq("id", contentId).select()
    return { data, error }
  },

  // 删除内容
  deleteContent: async (contentId: string) => {
    const { error } = await supabase.from("contents").delete().eq("id", contentId)
    return { error }
  },
}

// 用户设置和偏好
export const userPreferences = {
  // 保存用户偏好
  savePreferences: async (userId: string, preferences: any) => {
    const { data, error } = await supabase.from("user_preferences").upsert({ user_id: userId, preferences }).select()
    return { data, error }
  },

  // 获取用户偏好
  getPreferences: async (userId: string) => {
    const { data, error } = await supabase.from("user_preferences").select("preferences").eq("user_id", userId).single()
    return { data: data?.preferences, error }
  },
}

// 学习进度跟踪
export const learningProgress = {
  // 更新课程进度
  updateCourseProgress: async (userId: string, courseId: string, progress: number, completed: boolean) => {
    const { data, error } = await supabase
      .from("course_progress")
      .upsert({
        user_id: userId,
        course_id: courseId,
        progress,
        completed,
        last_updated: new Date().toISOString(),
      })
      .select()
    return { data, error }
  },

  // 获取用户的所有课程进度
  getUserCourseProgress: async (userId: string) => {
    const { data, error } = await supabase.from("course_progress").select("*").eq("user_id", userId)
    return { data, error }
  },

  // 获取特定课程的进度
  getCourseProgress: async (userId: string, courseId: string) => {
    const { data, error } = await supabase
      .from("course_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single()
    return { data, error }
  },
}

// 数据分析相关
export const analyticsService = {
  // 保存分析数据
  saveAnalyticsData: async (data: any) => {
    const { error } = await supabase.from("analytics_data").insert([data])
    return { error }
  },

  // 获取分析数据
  getAnalyticsData: async (userId: string, filters: any = {}) => {
    let query = supabase.from("analytics_data").select("*").eq("user_id", userId)

    // 应用过滤器
    if (filters.startDate) {
      query = query.gte("date", filters.startDate)
    }
    if (filters.endDate) {
      query = query.lte("date", filters.endDate)
    }
    if (filters.type) {
      query = query.eq("type", filters.type)
    }

    const { data, error } = await query.order("date", { ascending: false })
    return { data, error }
  },
}
