"use client"

import type React from "react"

import { useState, useRef, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCsrfProtection } from "@/lib/security/csrf-protection"
import { sanitizeHtml, validateEmail, validatePasswordStrength } from "@/lib/security/input-sanitizer"
import { cn } from "@/lib/utils"

interface FormField {
  name: string
  label: string
  type: string
  placeholder?: string
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: string
  validate?: (value: string) => { isValid: boolean; message?: string }
}

interface SecureFormProps {
  fields: FormField[]
  onSubmit: (data: Record<string, string>) => void
  submitText?: string
  className?: string
  loading?: boolean
}

export function SecureForm({ fields, onSubmit, submitText = "提交", className, loading = false }: SecureFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const formRef = useRef<HTMLFormElement>(null)
  const { csrfToken, addCsrfHeader } = useCsrfProtection()

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // 对输入进行净化
    const sanitizedValue = sanitizeHtml(value)

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }))

    // 标记字段为已触摸
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    // 验证字段
    validateField(name, sanitizedValue)
  }

  // 验证单个字段
  const validateField = (name: string, value: string) => {
    const field = fields.find((f) => f.name === name)
    if (!field) return

    let error = ""

    // 必填检查
    if (field.required && !value) {
      error = `${field.label}不能为空`
    }

    // 长度检查
    if (value && field.minLength && value.length < field.minLength) {
      error = `${field.label}长度不能少于${field.minLength}个字符`
    }

    if (value && field.maxLength && value.length > field.maxLength) {
      error = `${field.label}长度不能超过${field.maxLength}个字符`
    }

    // 模式检查
    if (value && field.pattern && !new RegExp(field.pattern).test(value)) {
      error = `${field.label}格式不正确`
    }

    // 特殊字段验证
    if (value && field.type === "email" && !validateEmail(value)) {
      error = "请输入有效的电子邮件地址"
    }

    if (value && field.type === "password") {
      const result = validatePasswordStrength(value)
      if (!result.isValid) {
        error = result.feedback[0] || "密码强度不足"
      }
    }

    // 自定义验证
    if (value && field.validate) {
      const result = field.validate(value)
      if (!result.isValid) {
        error = result.message || `${field.label}验证失败`
      }
    }

    // 更新错误状态
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))

    return !error
  }

  // 验证所有字段
  const validateForm = () => {
    let isValid = true
    const newErrors: Record<string, string> = {}
    const newTouched: Record<string, boolean> = {}

    fields.forEach((field) => {
      const value = formData[field.name] || ""
      newTouched[field.name] = true

      if (!validateField(field.name, value)) {
        isValid = false
        newErrors[field.name] = errors[field.name]
      }
    })

    setTouched(newTouched)
    setErrors(newErrors)

    return isValid
  }

  // 处理表单提交
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // 验证表单
    if (!validateForm()) {
      return
    }

    // 添加CSRF令牌
    const secureData = {
      ...formData,
      csrfToken,
    }

    // 调用提交回调
    onSubmit(secureData)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={cn("space-y-4", className)} noValidate>
      {/* 隐藏的CSRF令牌字段 */}
      <input type="hidden" name="csrfToken" value={csrfToken} />

      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name} className="text-sm font-medium text-slate-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          <Input
            id={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name] || ""}
            onChange={handleChange}
            required={field.required}
            minLength={field.minLength}
            maxLength={field.maxLength}
            pattern={field.pattern}
            className={cn(
              "border-slate-700 bg-slate-800/50 text-slate-200",
              errors[field.name] && touched[field.name] && "border-red-500",
            )}
            aria-invalid={errors[field.name] && touched[field.name] ? "true" : "false"}
            aria-describedby={`${field.name}-error`}
          />

          {errors[field.name] && touched[field.name] && (
            <p id={`${field.name}-error`} className="text-xs text-red-500 mt-1">
              {errors[field.name]}
            </p>
          )}
        </div>
      ))}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white"
        disabled={loading}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            处理中...
          </>
        ) : (
          submitText
        )}
      </Button>
    </form>
  )
}
