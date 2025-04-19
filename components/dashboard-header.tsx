// 添加注释，标记这个组件已被 EnhancedNavigation 替代
// 这个组件已被 EnhancedNavigation 替代，保留仅供参考
// 请在应用中使用 EnhancedNavigation 组件而不是这个组件
import { Button } from "@/components/ui/button"
import { Bell, Menu, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden text-slate-400 hover:text-white">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <span className="font-bold text-white">YY</span>
            </div>
            <span className="hidden font-bold text-white md:inline-block">Nexus AI</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              仪表盘
            </Button>
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              内容创作
            </Button>
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              数据分析
            </Button>
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              学习中心
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="搜索..."
              className="w-64 rounded-md border-slate-700 bg-slate-800 pl-8 text-sm text-slate-400 focus-visible:ring-blue-600"
            />
          </div>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
