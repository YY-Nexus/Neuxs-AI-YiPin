import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// 获取用户的图片生成历史
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ success: false, message: "未提供用户ID" }, { status: 401 })
    }

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const offset = (page - 1) * limit

    // 查询数据库
    const { data, error, count } = await supabase
      .from("image_history")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
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
    console.error("Get image history error:", error)
    return NextResponse.json({ success: false, message: "获取图片历史时发生错误" }, { status: 500 })
  }
}

// 添加图片生成历史
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, prompt, negative_prompt, image_url, style, params } = body

    if (!user_id || !prompt || !image_url) {
      return NextResponse.json({ success: false, message: "用户ID、提示词和图片URL不能为空" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("image_history")
      .insert([
        {
          user_id,
          prompt,
          negative_prompt,
          image_url,
          style,
          params: params || {},
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "图片历史记录添加成功",
      data: data[0],
    })
  } catch (error) {
    console.error("Add image history error:", error)
    return NextResponse.json({ success: false, message: "添加图片历史记录时发生错误" }, { status: 500 })
  }
}

// 删除图片历史记录
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ success: false, message: "未提供用户ID" }, { status: 401 })
    }

    if (!id) {
      return NextResponse.json({ success: false, message: "未提供记录ID" }, { status: 400 })
    }

    // 首先检查记录是否存在且属于该用户
    const { data: existingRecord, error: checkError } = await supabase
      .from("image_history")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .single()

    if (checkError || !existingRecord) {
      return NextResponse.json({ success: false, message: "记录不存在或无权删除" }, { status: 404 })
    }

    // 删除记录
    const { error } = await supabase.from("image_history").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "图片历史记录删除成功",
    })
  } catch (error) {
    console.error("Delete image history error:", error)
    return NextResponse.json({ success: false, message: "删除图片历史记录时发生错误" }, { status: 500 })
  }
}
