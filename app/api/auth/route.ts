import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// 注册新用户
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "邮箱和密码不能为空" }, { status: 400 })
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "注册成功，请查看邮箱确认",
      user: data.user,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "注册过程中发生错误" }, { status: 500 })
  }
}

// 登录用户
export async function PUT(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "邮箱和密码不能为空" }, { status: 400 })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "登录成功",
      user: data.user,
      session: data.session,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "登录过程中发生错误" }, { status: 500 })
  }
}

// 登出用户
export async function DELETE() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "登出成功",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, message: "登出过程中发生错误" }, { status: 500 })
  }
}
