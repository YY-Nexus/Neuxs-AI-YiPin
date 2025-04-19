"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    // 第一次渲染不需要动画
    setIsFirstRender(false)
  }, [])

  const variants = {
    hidden: { opacity: 0, x: 0, y: 20 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -20 },
  }

  return (
    <motion.div
      key={pathname}
      initial={isFirstRender ? "enter" : "hidden"}
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.3, type: "ease-in-out" }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}
