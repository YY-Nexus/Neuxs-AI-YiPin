"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Bell,
  Menu,
  Search,
  User,
  Home,
  PenTool,
  LineChart,
  BookOpen,
  Settings,
  LogOut,
  X,
  ChevronDown,
  Laptop,
  Smartphone,
  Tablet,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// 扩展导航项目，添加子菜单
const navigationItems = [
  {
    name: "仪表盘",
    href: "/",
    icon: Home,
    badge: { text: "新", variant: "blue" },
  },
  {
    name: "内容创作",
    href: "/content-creator",
    icon: PenTool,
    children: [
      { name: "基础创作", href: "/content-creator" },
      { name: "高级创作", href: "/content-creator/advanced" },
      { name: "增强创作", href: "/content-creator/enhanced" },
    ],
  },
  { name: "数据分析", href: "/analytics", icon: LineChart },
  { name: "学习中心", href: "/learning", icon: BookOpen },
]

export function EnhancedNavigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [scrolled, setScrolled] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // 检测屏幕尺寸
  const [screenSize, setScreenSize] = useState<"xs" | "sm" | "md" | "lg" | "xl">("lg")

  // 监听滚动事件，添加导航栏滚动效果
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    // 监听屏幕尺寸变化
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setScreenSize("xs")
      else if (width < 768) setScreenSize("sm")
      else if (width < 1024) setScreenSize("md")
      else if (width < 1280) setScreenSize("lg")
      else setScreenSize("xl")

      // 在大屏幕上重置移动菜单状态
      if (width >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }

      // 在大屏幕上重置搜索展开状态
      if (width >= 768) {
        setIsSearchExpanded(false)
      }
    }

    // 点击外部关闭搜索框
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
        if (screenSize === "xs" || screenSize === "sm") {
          setIsSearchExpanded(false)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
    document.addEventListener("mousedown", handleClickOutside)

    // 初始化屏幕尺寸
    handleResize()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen, screenSize])

  // 处理通知点击
  const handleNotificationClick = () => {
    setNotifications(0)
  }

  // 处理搜索框聚焦
  const handleSearchFocus = () => {
    setIsSearchFocused(true)
    setIsSearchExpanded(true)
    // 聚焦到输入框
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 100)
  }

  // 检查当前路径是否匹配导航项或其子项
  const isActiveRoute = (item: (typeof navigationItems)[0]) => {
    if (pathname === item.href) return true
    if (item.children) {
      return item.children.some((child) => pathname === child.href || pathname?.startsWith(child.href))
    }
    return item.href !== "/" && pathname?.startsWith(item.href)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-md"
          : "border-slate-800/50 bg-slate-900/80 backdrop-blur-sm",
      )}
    >
      <div className="flex h-16 items-center justify-between px-3 sm:px-4 md:px-6 max-w-[1920px] mx-auto">
        {/* 左侧 Logo 和导航 */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* 移动端菜单按钮 */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">打开菜单</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] p-0 bg-slate-900 border-slate-800"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <SheetHeader className="p-4 border-b border-slate-800">
                <SheetTitle className="flex items-center gap-2 text-white">
                  <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <span className="font-bold text-white">YY</span>
                  </div>
                  <span>Nexus AI</span>
                </SheetTitle>
              </SheetHeader>

              {/* 移动端搜索框 */}
              <div className="p-4 border-b border-slate-800">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    type="search"
                    placeholder="搜索..."
                    className="w-full rounded-md border-slate-700 bg-slate-800 pl-8 text-sm text-slate-400 focus-visible:ring-blue-600"
                  />
                </div>
              </div>

              <div className="py-4 overflow-y-auto max-h-[calc(100vh-140px)]">
                {navigationItems.map((item) => {
                  const isActive = isActiveRoute(item)

                  // 如果有子菜单，渲染可展开的菜单项
                  if (item.children) {
                    return (
                      <div key={item.name} className="px-2 mb-1">
                        <div
                          className={cn(
                            "flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive
                              ? "bg-blue-900/30 text-blue-100"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </div>
                          <ChevronDown className="h-4 w-4 opacity-70" />
                        </div>

                        <div className="mt-1 ml-9 space-y-1">
                          {item.children.map((child) => (
                            <SheetClose asChild key={child.name}>
                              <Link
                                href={child.href}
                                className={cn(
                                  "block px-2 py-1.5 text-sm rounded-md transition-colors",
                                  pathname === child.href
                                    ? "bg-blue-900/20 text-blue-100"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/30",
                                )}
                              >
                                {child.name}
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      </div>
                    )
                  }

                  // 普通菜单项
                  return (
                    <div key={item.name} className="px-2 mb-1">
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive
                              ? "bg-blue-900/30 text-blue-100"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                          {item.badge && (
                            <Badge variant={item.badge.variant as any} className="ml-auto text-[10px] px-1 py-0">
                              {item.badge.text}
                            </Badge>
                          )}
                        </Link>
                      </SheetClose>
                    </div>
                  )
                })}
              </div>

              {/* 移动端底部用户信息 */}
              <div className="mt-auto border-t border-slate-800 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <span className="font-bold text-white">YY</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">用户名</p>
                    <p className="text-xs text-slate-400">user@example.com</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                  >
                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                    设置
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-red-400 hover:text-red-300 hover:border-red-900/50"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1.5" />
                    退出
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <span className="font-bold text-white">YY</span>
            </div>
            <span
              className={cn(
                "font-bold text-white transition-opacity duration-200",
                isSearchExpanded && (screenSize === "xs" || screenSize === "sm") ? "hidden" : "hidden md:inline-block",
              )}
            >
              Nexus AI
            </span>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const isActive = isActiveRoute(item)

              // 如果有子菜单，渲染下拉菜单
              if (item.children) {
                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "text-sm h-9 gap-1.5",
                          isActive ? "bg-blue-900/30 text-blue-100" : "text-slate-400 hover:text-white",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span
                          className={cn(
                            "transition-opacity duration-200",
                            screenSize === "md" ? "sr-only" : "inline-block",
                          )}
                        >
                          {item.name}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 opacity-70 transition-transform duration-200",
                            screenSize === "md" ? "hidden" : "inline-block",
                          )}
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 bg-slate-900 border-slate-800">
                      <DropdownMenuLabel className="text-slate-400">{item.name}</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-slate-800" />
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.name} asChild>
                          <Link
                            href={child.href}
                            className={cn(
                              "w-full cursor-pointer",
                              pathname === child.href
                                ? "bg-blue-900/20 text-blue-100"
                                : "text-slate-200 focus:bg-slate-800 focus:text-white",
                            )}
                          >
                            {child.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }

              // 普通菜单项
              return (
                <TooltipProvider key={item.name} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "text-sm h-9 relative",
                          isActive ? "bg-blue-900/30 text-blue-100" : "text-slate-400 hover:text-white",
                        )}
                        asChild
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4 mr-2" />
                          <span
                            className={cn(
                              "transition-opacity duration-200",
                              screenSize === "md" ? "sr-only" : "inline-block",
                            )}
                          >
                            {item.name}
                          </span>
                          {item.badge && (
                            <Badge
                              variant={item.badge.variant as any}
                              className={cn(
                                "absolute -top-1 -right-1 text-[10px] px-1 py-0",
                                screenSize !== "md" && "hidden",
                              )}
                            >
                              {item.badge.text}
                            </Badge>
                          )}
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-slate-900 border-slate-800">
                      <p className="text-xs">{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </nav>
        </div>

        {/* 右侧搜索和用户功能 */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {/* 搜索框 */}
          <div
            ref={searchRef}
            className={cn(
              "relative transition-all duration-300 ease-in-out",
              isSearchExpanded ? "w-full xs:w-48 sm:w-56 md:w-64 lg:w-72" : "w-0 md:w-48 lg:w-64",
              isSearchFocused && "z-20",
            )}
          >
            <div
              className={cn(
                "absolute inset-y-0 left-0 flex items-center pl-3 transition-opacity",
                isSearchExpanded ? "opacity-100" : "opacity-0 md:opacity-100",
              )}
            >
              <Search className="h-4 w-4 text-slate-500" />
            </div>
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="搜索..."
              className={cn(
                "w-full rounded-md border-slate-700 bg-slate-800 pl-9 text-sm text-slate-400 focus-visible:ring-blue-600 transition-all h-9",
                isSearchExpanded ? "opacity-100" : "opacity-0 hidden md:block",
                isSearchFocused && "ring-2 ring-blue-600",
              )}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />

            {/* 搜索结果下拉框 */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-800 rounded-md shadow-lg overflow-hidden">
                <div className="p-2 text-xs text-slate-400">输入关键词搜索...</div>
              </div>
            )}
          </div>

          {/* 移动端搜索按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-400 hover:text-white hover:bg-slate-800/70"
            onClick={handleSearchFocus}
          >
            {isSearchExpanded ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            <span className="sr-only">搜索</span>
          </Button>

          {/* 设备切换按钮 - 仅在开发环境显示 */}
          {process.env.NODE_ENV === "development" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex text-slate-400 hover:text-white hover:bg-slate-800/70"
                >
                  <Laptop className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800">
                <DropdownMenuLabel>预览设备</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem className="text-slate-200 focus:bg-slate-800 focus:text-white cursor-pointer">
                  <Smartphone className="mr-2 h-4 w-4" />
                  <span>移动设备</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-200 focus:bg-slate-800 focus:text-white cursor-pointer">
                  <Tablet className="mr-2 h-4 w-4" />
                  <span>平板设备</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-200 focus:bg-slate-800 focus:text-white cursor-pointer">
                  <Laptop className="mr-2 h-4 w-4" />
                  <span>桌面设备</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* 通知按钮 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-400 hover:text-white hover:bg-slate-800/70"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
                    {notifications}
                  </span>
                )}
                <span className="sr-only">通知</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={cn("bg-slate-900 border-slate-800", screenSize === "xs" ? "w-[calc(100vw-24px)]" : "w-80")}
            >
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>通知</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-slate-400 hover:text-white"
                  onClick={handleNotificationClick}
                >
                  全部标为已读
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <div className="max-h-[min(400px,70vh)] overflow-y-auto py-1">
                <div className="px-2 py-1.5 hover:bg-slate-800/50 rounded-md mx-1 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                      <PenTool className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">您的内容创作已完成</p>
                      <p className="text-xs text-slate-400">系统已生成您请求的电商文案</p>
                      <p className="text-xs text-slate-500 mt-1">2分钟前</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                  </div>
                </div>
                <div className="px-2 py-1.5 hover:bg-slate-800/50 rounded-md mx-1 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0">
                      <LineChart className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">数据分析报告已生成</p>
                      <p className="text-xs text-slate-400">您的周报已准备就绪，点击查看详情</p>
                      <p className="text-xs text-slate-500 mt-1">1小时前</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                  </div>
                </div>
                <div className="px-2 py-1.5 hover:bg-slate-800/50 rounded-md mx-1 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-orange-600/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-4 w-4 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">新课程已上线</p>
                      <p className="text-xs text-slate-400">《高级电商文案写作》课程已发布</p>
                      <p className="text-xs text-slate-500 mt-1">昨天</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-slate-800" />
              <div className="py-2 px-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                >
                  查看全部通知
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 用户菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800/70">
                <User className="h-5 w-5" />
                <span className="sr-only">用户菜单</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={cn("bg-slate-900 border-slate-800", screenSize === "xs" ? "w-[calc(100vw-24px)]" : "w-56")}
            >
              <div className="flex items-center gap-2 p-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <span className="font-bold text-white">YY</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">用户名</p>
                  <p className="text-xs text-slate-400 truncate">user@example.com</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem className="text-slate-200 focus:bg-slate-800 focus:text-white cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>个人资料</span>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-slate-200 focus:bg-slate-800 focus:text-white cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>设置</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-slate-900 border-slate-800">
                    <DropdownMenuItem className="text-slate-200 focus:bg-slate-800 focus:text-white cursor-pointer">
                      <span>账户设置</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-slate-200 focus:bg-slate-800 focus:text-white cursor-pointer">
                      <span>界面设置</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-slate-200 focus:bg-slate-800 focus:text-white cursor-pointer">
                      <span>通知设置</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem className="text-red-400 focus:bg-red-900/30 focus:text-red-300 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 响应式设计指示器 - 仅在开发环境显示 */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-1 left-1 z-50 flex items-center justify-center rounded-full bg-gray-800 p-1.5 text-xs text-white">
          <span className="block xs:hidden">xs</span>
          <span className="hidden xs:block sm:hidden">sm</span>
          <span className="hidden sm:block md:hidden">md</span>
          <span className="hidden md:block lg:hidden">lg</span>
          <span className="hidden lg:block xl:hidden">xl</span>
          <span className="hidden xl:block">2xl</span>
        </div>
      )}
    </header>
  )
}
