"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  email: string
  user_metadata?: any
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // 初始化时检查用户状态
  useEffect(() => {
    const checkUser = async () => {
      try {
        // 从本地存储获取用户信息
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error checking user:", error)
      } finally {
        setLoading(false)
      }
    }

    // 只在客户端执行
    if (typeof window !== "undefined") {
      checkUser()
    } else {
      setLoading(false)
    }
  }, [])

  // 登录
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模拟成功登录
      const mockUser = {
        id: "1",
        email,
        user_metadata: {
          name: "Test User",
        },
      }

      setUser(mockUser)

      // 保存到本地存储
      localStorage.setItem("user", JSON.stringify(mockUser))

      toast({
        title: "登录成功",
        description: "欢迎回来！",
      })

      return Promise.resolve()
    } catch (error: any) {
      toast({
        title: "登录失败",
        description: error.message || "请检查您的邮箱和密码",
        variant: "destructive",
      })
      return Promise.reject(error)
    } finally {
      setLoading(false)
    }
  }

  // 注册
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "注册成功",
        description: "请查看您的邮箱以确认注册",
      })

      return Promise.resolve()
    } catch (error: any) {
      toast({
        title: "注册失败",
        description: error.message || "注册过程中出现错误",
        variant: "destructive",
      })
      return Promise.reject(error)
    } finally {
      setLoading(false)
    }
  }

  // 登出
  const signOut = async () => {
    try {
      setLoading(true)

      // 清除本地存储
      localStorage.removeItem("user")
      setUser(null)

      toast({
        title: "已登出",
        description: "您已成功登出系统",
      })

      return Promise.resolve()
    } catch (error: any) {
      toast({
        title: "登出失败",
        description: error.message || "登出过程中出现错误",
        variant: "destructive",
      })
      return Promise.reject(error)
    } finally {
      setLoading(false)
    }
  }

  // 更新用户资料
  const updateProfile = async (data: any) => {
    try {
      setLoading(true)

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 更新用户信息
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)

      // 更新本地存储
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }

      toast({
        title: "资料已更新",
        description: "您的个人资料已成功更新",
      })

      return Promise.resolve()
    } catch (error: any) {
      toast({
        title: "更新失败",
        description: error.message || "更新资料过程中出现错误",
        variant: "destructive",
      })
      return Promise.reject(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
