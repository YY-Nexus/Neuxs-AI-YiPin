"use client"

/**
 * 客户端速率限制器
 * 防止过多的API请求，减轻服务器负担并防止滥用
 */

interface RateLimitOptions {
  maxRequests: number
  timeWindow: number // 毫秒
  storageKey?: string
}

interface RateLimitState {
  requests: Array<number>
  blocked: boolean
  blockedUntil: number
}

export class RateLimiter {
  private options: RateLimitOptions
  private state: RateLimitState

  constructor(options: RateLimitOptions) {
    this.options = {
      storageKey: "rate_limiter",
      ...options,
    }

    // 尝试从存储中恢复状态
    const savedState = localStorage.getItem(this.options.storageKey || "")

    if (savedState) {
      try {
        this.state = JSON.parse(savedState)
      } catch (e) {
        this.resetState()
      }
    } else {
      this.resetState()
    }

    // 清理过期的请求记录
    this.cleanupExpiredRequests()
  }

  private resetState(): void {
    this.state = {
      requests: [],
      blocked: false,
      blockedUntil: 0,
    }
  }

  private saveState(): void {
    localStorage.setItem(this.options.storageKey || "", JSON.stringify(this.state))
  }

  private cleanupExpiredRequests(): void {
    const now = Date.now()
    const timeWindow = this.options.timeWindow

    // 移除超出时间窗口的请求
    this.state.requests = this.state.requests.filter((timestamp) => now - timestamp < timeWindow)

    // 检查是否仍然被阻止
    if (this.state.blocked && now > this.state.blockedUntil) {
      this.state.blocked = false
    }

    this.saveState()
  }

  /**
   * 检查是否可以执行请求
   * @returns 如果可以执行请求，则返回true；否则返回false
   */
  canMakeRequest(): boolean {
    this.cleanupExpiredRequests()

    // 如果被阻止，则不允许请求
    if (this.state.blocked) {
      return false
    }

    // 检查是否超过最大请求数
    return this.state.requests.length < this.options.maxRequests
  }

  /**
   * 记录一个请求
   * @returns 如果请求被记录，则返回true；如果被阻止，则返回false
   */
  recordRequest(): boolean {
    if (!this.canMakeRequest()) {
      // 如果已经被阻止，则继续阻止
      if (!this.state.blocked) {
        this.state.blocked = true
        this.state.blockedUntil = Date.now() + this.options.timeWindow
        this.saveState()
      }
      return false
    }

    // 记录请求
    this.state.requests.push(Date.now())
    this.saveState()
    return true
  }

  /**
   * 获取剩余的可用请求数
   */
  getRemainingRequests(): number {
    this.cleanupExpiredRequests()
    return Math.max(0, this.options.maxRequests - this.state.requests.length)
  }

  /**
   * 获取阻止状态的剩余时间（毫秒）
   */
  getBlockedTimeRemaining(): number {
    if (!this.state.blocked) {
      return 0
    }

    return Math.max(0, this.state.blockedUntil - Date.now())
  }

  /**
   * 重置限制器状态
   */
  reset(): void {
    this.resetState()
    this.saveState()
  }
}
