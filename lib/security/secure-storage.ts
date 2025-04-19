"use client"

/**
 * 安全存储工具
 * 提供加密的本地存储功能，保护敏感数据
 */

// 生成加密密钥
const generateEncryptionKey = (): string => {
  const array = new Uint8Array(16)
  window.crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

// 获取或创建加密密钥
const getEncryptionKey = (): string => {
  let key = localStorage.getItem("encryption_key")

  if (!key) {
    key = generateEncryptionKey()
    localStorage.setItem("encryption_key", key)
  }

  return key
}

// 简单的加密函数（实际应用中应使用更强大的加密库）
const encrypt = (text: string, key: string): string => {
  try {
    // 简单的XOR加密，仅用于演示
    // 实际应用中应使用Web Crypto API或加密库
    const textBytes = new TextEncoder().encode(text)
    const keyBytes = new TextEncoder().encode(key)

    const encryptedBytes = new Uint8Array(textBytes.length)
    for (let i = 0; i < textBytes.length; i++) {
      encryptedBytes[i] = textBytes[i] ^ keyBytes[i % keyBytes.length]
    }

    return btoa(String.fromCharCode(...encryptedBytes))
  } catch (error) {
    console.error("加密失败:", error)
    return ""
  }
}

// 简单的解密函数
const decrypt = (encryptedText: string, key: string): string => {
  try {
    const encryptedBytes = new Uint8Array(
      atob(encryptedText)
        .split("")
        .map((char) => char.charCodeAt(0)),
    )
    const keyBytes = new TextEncoder().encode(key)

    const decryptedBytes = new Uint8Array(encryptedBytes.length)
    for (let i = 0; i < encryptedBytes.length; i++) {
      decryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length]
    }

    return new TextDecoder().decode(decryptedBytes)
  } catch (error) {
    console.error("解密失败:", error)
    return ""
  }
}

// 安全存储API
export const secureStorage = {
  // 存储加密数据
  setItem: (key: string, value: string): void => {
    try {
      const encryptionKey = getEncryptionKey()
      const encryptedValue = encrypt(value, encryptionKey)
      localStorage.setItem(`secure_${key}`, encryptedValue)
    } catch (error) {
      console.error("安全存储失败:", error)
    }
  },

  // 获取并解密数据
  getItem: (key: string): string | null => {
    try {
      const encryptionKey = getEncryptionKey()
      const encryptedValue = localStorage.getItem(`secure_${key}`)

      if (!encryptedValue) return null

      return decrypt(encryptedValue, encryptionKey)
    } catch (error) {
      console.error("安全获取失败:", error)
      return null
    }
  },

  // 删除数据
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(`secure_${key}`)
    } catch (error) {
      console.error("安全删除失败:", error)
    }
  },

  // 清除所有安全存储的数据
  clear: (): void => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("secure_")) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error("安全清除失败:", error)
    }
  },
}
