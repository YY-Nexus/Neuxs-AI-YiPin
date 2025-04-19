import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// 获取分析数据
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ success: false, message: "未提供用户ID" }, { status: 401 })
    }

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // 构建查询
    let query = supabase.from("analytics_data").select("*").eq("user_id", userId)

    if (type) {
      query = query.eq("type", type)
    }

    if (startDate) {
      query = query.gte("date", startDate)
    }

    if (endDate) {
      query = query.lte("date", endDate)
    }

    // 执行查询
    const { data, error } = await query.order("date", { ascending: false })

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    // 处理数据，按类型分组
    const groupedData: Record<string, any[]> = {}

    data.forEach((item) => {
      if (!groupedData[item.type]) {
        groupedData[item.type] = []
      }
      groupedData[item.type].push({
        date: item.date,
        ...item.data,
      })
    })

    return NextResponse.json({
      success: true,
      data: groupedData,
    })
  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json({ success: false, message: "获取分析数据时发生错误" }, { status: 500 })
  }
}

// 添加分析数据
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, type, date, data } = body

    if (!user_id || !type || !date || !data) {
      return NextResponse.json({ success: false, message: "用户ID、类型、日期和数据不能为空" }, { status: 400 })
    }

    const { error } = await supabase.from("analytics_data").insert([
      {
        user_id,
        type,
        date,
        data,
      },
    ])

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "分析数据添加成功",
    })
  } catch (error) {
    console.error("Add analytics error:", error)
    return NextResponse.json({ success: false, message: "添加分析数据时发生错误" }, { status: 500 })
  }
}
