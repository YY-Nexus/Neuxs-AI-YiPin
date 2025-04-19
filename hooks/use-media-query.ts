"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // 初始检查
    const media = window.matchMedia(query)
    setMatches(media.matches)

    // 添加监听器
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    // 现代浏览器使用 addEventListener
    if (media.addEventListener) {
      media.addEventListener("change", listener)
      return () => media.removeEventListener("change", listener)
    } else {
      // 旧版浏览器使用 addListener (已废弃但提供兼容性)
      media.addListener(listener)
      return () => media.removeListener(listener)
    }
  }, [query])

  return matches
}
