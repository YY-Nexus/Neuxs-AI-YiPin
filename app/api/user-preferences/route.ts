import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// 获取用户偏好设置
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ success: false, message: "未提供用户ID" }, { status: 401 })
    }

    const { data, error } = await supabase.from("user_preferences").select("preferences").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 是"没有找到结果"的错误代码
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: data?.preferences || {},
    })
  } catch (error) {
    console.error("Get user preferences error:", error)
    return NextResponse.json({ success: false, message: "获取用户偏好设置时发生错误" }, { status: 500 })
  }
}

// 更新用户偏好设置
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, preferences } = body

    if (!user_id || !preferences) {
      return NextResponse.json({ success: false, message: "用户ID和偏好设置不能为空" }, { status: 400 })
    }

    // 检查记录是否已存在
    const { data: existingData, error: checkError } = await supabase
      .from("user_preferences")
      .select("preferences")
      .eq("user_id", user_id)
      .maybeSingle()

    let result

    if (existingData) {
      // 更新现有记录
      result = await supabase
        .from("user_preferences")
        .update({
          preferences: {
            ...existingData.preferences,
            ...preferences,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user_id)
        .select()
    } else {
      // 创建新记录
      result = await supabase
        .from("user_preferences")
        .insert([
          {
            user_id,
            preferences,
          },
        ])
        .select()
    }

    if (result.error) {
      return NextResponse.json({ success: false, message: result.error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "用户偏好设置更新成功",
      data: result.data[0],
    })
  } catch (error) {
    console.error("Update user preferences error:", error)
    return NextResponse.json({ success: false, message: "更新用户偏好设置时发生错误" }, { status: 500 })
  }
}
