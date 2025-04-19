/**
 * 输入净化工具
 * 清理用户输入，防止XSS攻击和SQL注入
 */

// 防止XSS攻击
export function sanitizeHtml(input: string): string {
  if (!input) return ""

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// 防止SQL注入
export function sanitizeSqlInput(input: string): string {
  if (!input) return ""

  // 移除SQL注入常见的危险字符
  return input
    .replace(/'/g, "''") // 转义单引号
    .replace(/;/g, "") // 移除分号
    .replace(/--/g, "") // 移除注释标记
    .replace(/\/\*/g, "") // 移除块注释开始
    .replace(/\*\//g, "") // 移除块注释结束
    .replace(/xp_/gi, "") // 移除扩展存储过程前缀
    .replace(/exec\s+/gi, "") // 移除exec命令
    .replace(/UNION\s+SELECT/gi, "") // 移除UNION SELECT
}

// 验证电子邮件格式
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

// 验证密码强度
export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  // 长度检查
  if (password.length < 8) {
    feedback.push("密码长度至少为8个字符")
  } else {
    score += 1
  }

  // 复杂性检查
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (!/[A-Z]/.test(password)) feedback.push("密码应包含至少一个大写字母")
  if (!/[a-z]/.test(password)) feedback.push("密码应包含至少一个小写字母")
  if (!/[0-9]/.test(password)) feedback.push("密码应包含至少一个数字")
  if (!/[^A-Za-z0-9]/.test(password)) feedback.push("密码应包含至少一个特殊字符")

  // 常见密码检查
  const commonPasswords = ["password", "123456", "qwerty", "admin", "welcome"]
  if (commonPasswords.includes(password.toLowerCase())) {
    feedback.push("请不要使用常见密码")
    score = 0
  }

  return {
    isValid: score >= 3 && password.length >= 8,
    score,
    feedback,
  }
}

export const sanitizeInput = sanitizeHtml
