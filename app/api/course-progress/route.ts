import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// 获取用户的所有课程进度
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ success: false, message: "未提供用户ID" }, { status: 401 })
    }

    const { data, error } = await supabase.from("course_progress").select("*").eq("user_id", userId)

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Get course progress error:", error)
    return NextResponse.json({ success: false, message: "获取课程进度时发生错误" }, { status: 500 })
  }
}

// 更新课程进度
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, course_id, progress, completed } = body

    if (!user_id || !course_id || progress === undefined) {
      return NextResponse.json({ success: false, message: "用户ID、课程ID和进度不能为空" }, { status: 400 })
    }

    // 检查记录是否已存在
    const { data: existingData, error: checkError } = await supabase
      .from("course_progress")
      .select("id")
      .eq("user_id", user_id)
      .eq("course_id", course_id)
      .maybeSingle()

    let result

    if (existingData) {
      // 更新现有记录
      result = await supabase
        .from("course_progress")
        .update({
          progress,
          completed: completed !== undefined ? completed : progress === 100,
          last_updated: new Date().toISOString(),
        })
        .eq("user_id", user_id)
        .eq("course_id", course_id)
        .select()
    } else {
      // 创建新记录
      result = await supabase
        .from("course_progress")
        .insert([
          {
            user_id,
            course_id,
            progress,
            completed: completed !== undefined ? completed : progress === 100,
            last_updated: new Date().toISOString(),
          },
        ])
        .select()
    }

    if (result.error) {
      return NextResponse.json({ success: false, message: result.error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: existingData ? "课程进度更新成功" : "课程进度创建成功",
      data: result.data[0],
    })
  } catch (error) {
    console.error("Update course progress error:", error)
    return NextResponse.json({ success: false, message: "更新课程进度时发生错误" }, { status: 500 })
  }
}
