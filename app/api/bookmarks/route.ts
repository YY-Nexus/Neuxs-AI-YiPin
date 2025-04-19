import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// 获取用户的收藏
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ success: false, message: "未提供用户ID" }, { status: 401 })
    }

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams
    const itemType = searchParams.get("itemType")

    // 构建查询
    let query = supabase.from("bookmarks").select("*").eq("user_id", userId)

    if (itemType) {
      query = query.eq("item_type", itemType)
    }

    // 执行查询
    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Get bookmarks error:", error)
    return NextResponse.json({ success: false, message: "获取收藏时发生错误" }, { status: 500 })
  }
}

// 添加收藏
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, item_type, item_id } = body

    if (!user_id || !item_type || !item_id) {
      return NextResponse.json({ success: false, message: "用户ID、项目类型和项目ID不能为空" }, { status: 400 })
    }

    // 检查是否已收藏
    const { data: existingBookmark, error: checkError } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user_id)
      .eq("item_type", item_type)
      .eq("item_id", item_id)
      .maybeSingle()

    if (existingBookmark) {
      return NextResponse.json({
        success: true,
        message: "项目已收藏",
        data: existingBookmark,
      })
    }

    // 添加收藏
    const { data, error } = await supabase
      .from("bookmarks")
      .insert([
        {
          user_id,
          item_type,
          item_id,
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "收藏成功",
      data: data[0],
    })
  } catch (error) {
    console.error("Add bookmark error:", error)
    return NextResponse.json({ success: false, message: "添加收藏时发生错误" }, { status: 500 })
  }
}

// 删除收藏
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const searchParams = request.nextUrl.searchParams
    const itemType = searchParams.get("itemType")
    const itemId = searchParams.get("itemId")

    if (!userId) {
      return NextResponse.json({ success: false, message: "未提供用户ID" }, { status: 401 })
    }

    if (!itemType || !itemId) {
      return NextResponse.json({ success: false, message: "未提供项目类型或项目ID" }, { status: 400 })
    }

    // 删除收藏
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("item_type", itemType)
      .eq("item_id", itemId)

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "取消收藏成功",
    })
  } catch (error) {
    console.error("Delete bookmark error:", error)
    return NextResponse.json({ success: false, message: "取消收藏时发生错误" }, { status: 500 })
  }
}
