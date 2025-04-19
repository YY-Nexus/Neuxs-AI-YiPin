import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// 获取用户内容列表
export async function GET(request: NextRequest) {
  try {
    // 从请求中获取用户ID
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ success: false, message: "未提供用户ID" }, { status: 401 })
    }

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const offset = (page - 1) * limit

    // 查询数据库
    const { data, error, count } = await supabase
      .from("contents")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Get contents error:", error)
    return NextResponse.json({ success: false, message: "获取内容列表时发生错误" }, { status: 500 })
  }
}

// 创建新内容
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, title, keywords, content, metadata } = body

    if (!user_id || !title || !content) {
      return NextResponse.json({ success: false, message: "用户ID、标题和内容不能为空" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("contents")
      .insert([
        {
          user_id,
          title,
          keywords,
          content,
          metadata: metadata || {},
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "内容创建成功",
      data: data[0],
    })
  } catch (error) {
    console.error("Create content error:", error)
    return NextResponse.json({ success: false, message: "创建内容时发生错误" }, { status: 500 })
  }
}
