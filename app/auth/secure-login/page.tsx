"use client"

import { useState, type FormEvent } from "react"
import { useCsrfProtection } from "@/lib/security/csrf-protection"
import { RateLimiter } from "@/lib/security/rate-limiter"
import { sanitizeInput } from "@/lib/security/input-sanitizer"
import { PasswordStrengthMeter } from "@/components/security/password-strength-meter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Lock, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

// 创建速率限制器实例
const loginRateLimiter = new RateLimiter({
  maxRequests: 5, // 5次尝试
  timeWindow: 60 * 1000, // 1分钟
  storageKey: "login_rate_limiter",
})

export default function SecureLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remainingAttempts, setRemainingAttempts] = useState(loginRateLimiter.getRemainingRequests())
  const { csrfToken, addCsrfHeader } = useCsrfProtection()
  const { toast } = useToast()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 检查速率限制
    if (!loginRateLimiter.canMakeRequest()) {
      setError(`登录尝试次数过多，请在${Math.ceil(loginRateLimiter.getBlockedTimeRemaining() / 1000)}秒后重试`)
      return
    }

    // 记录请求
    loginRateLimiter.recordRequest()
    setRemainingAttempts(loginRateLimiter.getRemainingRequests())

    // 清除错误
    setError(null)
    setIsLoading(true)

    try {
      // 清理输入
      const sanitizedEmail = sanitizeInput(email)

      // 模拟API调用
      setTimeout(() => {
        // 模拟登录成功
        toast({
          title: "登录成功",
          description: "欢迎回来！",
          duration: 3000,
        })

        setIsLoading(false)
      }, 1500)
    } catch (err) {
      console.error("登录错误:", err)
      setError(err instanceof Error ? err.message : "登录失败，请重试")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 to-blue-950 p-4">
      <Card className="w-full max-w-md bg-slate-900/80 border-slate-800 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">安全登录</CardTitle>
          <CardDescription className="text-slate-400">使用您的电子邮件和密码登录</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {remainingAttempts < 3 && (
            <Alert className="mb-4 bg-slate-800 text-amber-400 border-amber-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>您还有 {remainingAttempts} 次登录尝试机会</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                电子邮件
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="border-slate-700 bg-slate-800/50 text-slate-200"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300">
                  密码
                </Label>
                <Link href="/auth/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                  忘记密码?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="current-password"
                className="border-slate-700 bg-slate-800/50 text-slate-200"
              />

              {password && <PasswordStrengthMeter password={password} />}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white"
              disabled={isLoading || remainingAttempts === 0}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登录中...
                </span>
              ) : (
                <span className="flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  安全登录
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-slate-500">
            <Lock className="inline h-3 w-3 mr-1" />
            使用安全加密连接保护您的信息
          </div>
          <div className="text-center">
            <span className="text-sm text-slate-400">还没有账号? </span>
            <Link href="/auth/register" className="text-sm font-medium text-blue-400 hover:text-blue-300">
              注册 <ArrowRight className="inline h-3 w-3" />
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
