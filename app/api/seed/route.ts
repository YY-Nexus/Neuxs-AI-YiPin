import { NextResponse } from "next/server"
import { seedAllData } from "@/lib/database-seed"

export async function GET() {
  try {
    const result = await seedAllData()

    if (result) {
      return NextResponse.json({ success: true, message: "示例数据添加成功" })
    } else {
      return NextResponse.json({ success: false, message: "部分或全部示例数据添加失败" }, { status: 500 })
    }
  } catch (error) {
    console.error("Seed API error:", error)
    return NextResponse.json(
      { success: false, message: "添加示例数据时发生错误", error: String(error) },
      { status: 500 },
    )
  }
}
