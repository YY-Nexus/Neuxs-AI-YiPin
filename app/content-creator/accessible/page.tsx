"use client"

import { PageTransition } from "@/components/page-transition"
import { SkipLink } from "@/components/a11y/skip-link"
import { AccessibleIcon } from "@/components/a11y/accessible-icon"
import { AccessibleButton } from "@/components/a11y/accessible-button"
import { FocusTrap } from "@/components/a11y/focus-trap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Edit, Save, Copy, Download, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AccessiblePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [title, setTitle] = useState("轻奢真丝几何剪裁连衣裙")
  const [content, setContent] = useState(
    "这款新品连衣裙采用高级真丝面料，触感柔滑，穿着舒适。独特的几何剪裁设计，勾勒出完美曲线，尽显优雅气质。",
  )

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 to-blue-950">
        {/* 跳过导航链接 */}
        <SkipLink />

        <main id="main-content" className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">可访问性示例</h1>
              <p className="text-muted-foreground text-blue-300">展示改进的可访问性组件和最佳实践</p>
            </div>

            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">可访问的内容编辑器</CardTitle>
                <CardDescription className="text-slate-400">
                  这个编辑器遵循WCAG标准，支持屏幕阅读器和键盘导航
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-400 mb-1">
                    标题
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-slate-700 bg-slate-800/50 text-slate-200"
                    aria-describedby="title-description"
                  />
                  <p id="title-description" className="text-xs text-slate-500 mt-1">
                    输入内容的标题，将显示在预览中
                  </p>
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-slate-400 mb-1">
                    内容
                  </label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[150px] border-slate-700 bg-slate-800/50 text-slate-200 resize-none"
                    aria-describedby="content-description"
                  />
                  <p id="content-description" className="text-xs text-slate-500 mt-1">
                    输入详细内容，支持多段落文本
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <AccessibleButton
                  label="保存内容"
                  description="保存当前编辑的内容"
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white gap-2"
                >
                  <AccessibleIcon icon={<Save className="h-4 w-4" />} label="保存图标" />
                  保存
                </AccessibleButton>

                <AccessibleButton
                  label="复制内容"
                  variant="outline"
                  className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 gap-2"
                >
                  <AccessibleIcon icon={<Copy className="h-4 w-4" />} label="复制图标" />
                  复制
                </AccessibleButton>

                <AccessibleButton
                  label="下载内容"
                  variant="outline"
                  className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 gap-2"
                >
                  <AccessibleIcon icon={<Download className="h-4 w-4" />} label="下载图标" />
                  下载
                </AccessibleButton>

                <AccessibleButton
                  label="打开编辑对话框"
                  variant="outline"
                  className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 gap-2"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <AccessibleIcon icon={<Edit className="h-4 w-4" />} label="编辑图标" />
                  高级编辑
                </AccessibleButton>
              </CardFooter>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">可访问性最佳实践</CardTitle>
                <CardDescription className="text-slate-400">我们实现的可访问性改进</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc list-inside text-slate-300">
                  <li>添加了跳过导航链接，方便键盘用户直接跳到主要内容</li>
                  <li>为所有交互元素提供了清晰的焦点状态</li>
                  <li>确保所有表单控件都有关联的标签</li>
                  <li>为图标添加了屏幕阅读器描述</li>
                  <li>实现了焦点陷阱，确保模态框中的键盘导航</li>
                  <li>添加了ARIA属性，提高屏幕阅读器兼容性</li>
                  <li>确保颜色对比度符合WCAG标准</li>
                  <li>支持键盘导航和操作</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* 可访问的对话框 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-slate-900 border-slate-800">
            <FocusTrap active={isDialogOpen}>
              <DialogHeader className="flex items-center justify-between">
                <DialogTitle className="text-white">高级编辑</DialogTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)} aria-label="关闭对话框">
                  <X className="h-4 w-4" />
                </Button>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <label htmlFor="dialog-title" className="block text-sm font-medium text-slate-400 mb-1">
                    标题
                  </label>
                  <Input
                    id="dialog-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-slate-700 bg-slate-800/50 text-slate-200"
                  />
                </div>

                <div>
                  <label htmlFor="dialog-content" className="block text-sm font-medium text-slate-400 mb-1">
                    内容
                  </label>
                  <Textarea
                    id="dialog-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[150px] border-slate-700 bg-slate-800/50 text-slate-200 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    应用更改
                  </Button>
                </div>
              </div>
            </FocusTrap>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  )
}
