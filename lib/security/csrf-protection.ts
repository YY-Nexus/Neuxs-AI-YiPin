"use client"

import { useState, useEffect } from "react"

/**
 * CSRF令牌管理
 * 生成、存储和验证CSRF令牌，防止跨站请求伪造攻击
 */
export function useCsrfProtection() {
  const [csrfToken, setCsrfToken] = useState<string>("")

  // 生成CSRF令牌
  useEffect(() => {
    const generateToken = () => {
      const array = new Uint8Array(32)
      window.crypto.getRandomValues(array)
      return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
    }

    // 从cookie中获取令牌或生成新令牌
    const getCsrfToken = () => {
      const tokenMatch = document.cookie.match(/csrfToken=([^;]+)/)
      if (tokenMatch) {
        return tokenMatch[1]
      }

      const newToken = generateToken()
      // 设置HttpOnly和SameSite=Strict以增强安全性
      document.cookie = `csrfToken=${newToken}; path=/; max-age=3600; SameSite=Strict`
      return newToken
    }

    setCsrfToken(getCsrfToken())
  }, [])

  // 验证CSRF令牌
  const validateCsrfToken = (token: string) => {
    return token === csrfToken
  }

  // 添加CSRF令牌到请求头
  const addCsrfHeader = (headers: HeadersInit = {}) => {
    return {
      ...headers,
      "X-CSRF-Token": csrfToken,
    }
  }

  return {
    csrfToken,
    validateCsrfToken,
    addCsrfHeader,
  }
}
