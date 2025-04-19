import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// 获取单个内容
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ success: false, message: "未提供用户ID" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("contents")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .single()

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    if (!data) {
      return NextResponse.json({ success: false, message: "内容不存在或无权访问" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Get content error:", error)
    return NextResponse.json({ success: false, message: "获取内容时发生错误" }, { status: 500 })
  }
}

// 更新内容
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { title, keywords, content, metadata } = body
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ success: false, message: "未提供用户ID" }, { status: 401 })
    }

    // 首先检查内容是否存在且属于该用户
    const { data: existingContent, error: checkError } = await supabase
      .from("contents")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .single()

    if (checkError || !existingContent) {
      return NextResponse.json({ success: false, message: "内容不存在或无权更新" }, { status: 404 })
    }

    // 更新内容
    const updates: any = {
      updated_at: new Date().toISOString(),
    }

    if (title !== undefined) updates.title = title
    if (keywords !== undefined) updates.keywords = keywords
    if (content !== undefined) updates.content = content
    if (metadata !== undefined) updates.metadata = metadata

    const { data, error } = await supabase.from("contents").update(updates).eq("id", id).select()

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "内容更新成功",
      data: data[0],
    })
  } catch (error) {
    console.error("Update content error:", error)
    return NextResponse.json({ success: false, message: "更新内容时发生错误" }, { status: 500 })
  }
}

// 删除内容（软删除）
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ success: false, message: "未提供用户ID" }, { status: 401 })
    }

    // 首先检查内容是否存在且属于该用户
    const { data: existingContent, error: checkError } = await supabase
      .from("contents")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .single()

    if (checkError || !existingContent) {
      return NextResponse.json({ success: false, message: "内容不存在或无权删除" }, { status: 404 })
    }

    // 软删除内容
    const { error } = await supabase.from("contents").update({ is_deleted: true }).eq("id", id)

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "内容删除成功",
    })
  } catch (error) {
    console.error("Delete content error:", error)
    return NextResponse.json({ success: false, message: "删除内容时发生错误" }, { status: 500 })
  }
}
