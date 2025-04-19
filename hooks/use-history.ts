"use client"

import { useState, useCallback } from "react"

/**
 * 通用历史记录管理钩子
 * @param initialState 初始状态
 * @param maxHistory 最大历史记录数量
 * @returns 历史记录管理对象
 */
export function useHistory<T>(initialState: T, maxHistory = 50) {
  // 当前状态
  const [state, setState] = useState<T>(initialState)
  // 历史记录栈
  const [history, setHistory] = useState<T[]>([initialState])
  // 当前在历史记录中的位置
  const [position, setPosition] = useState(0)
  // 是否正在进行撤销/重做操作
  const [isHistoryAction, setIsHistoryAction] = useState(false)

  // 更新状态并记录历史
  const updateState = useCallback(
    (newState: T | ((prevState: T) => T)) => {
      if (isHistoryAction) {
        // 如果是撤销/重做操作，不记录历史
        setIsHistoryAction(false)
        return
      }

      setState((prevState) => {
        // 计算新状态
        const nextState = typeof newState === "function" ? (newState as (prevState: T) => T)(prevState) : newState

        // 更新历史记录
        setHistory((prevHistory) => {
          // 移除当前位置之后的所有历史记录
          const newHistory = prevHistory.slice(0, position + 1)
          // 添加新状态到历史记录
          const updatedHistory = [...newHistory, nextState]
          // 如果历史记录超过最大数量，移除最早的记录
          return updatedHistory.length > maxHistory
            ? updatedHistory.slice(updatedHistory.length - maxHistory)
            : updatedHistory
        })

        // 更新位置
        setPosition((prev) => prev + 1)

        return nextState
      })
    },
    [isHistoryAction, position, maxHistory],
  )

  // 撤销操作
  const undo = useCallback(() => {
    if (position > 0) {
      setIsHistoryAction(true)
      setPosition((prev) => prev - 1)
      setState(history[position - 1])
    }
  }, [history, position])

  // 重做操作
  const redo = useCallback(() => {
    if (position < history.length - 1) {
      setIsHistoryAction(true)
      setPosition((prev) => prev + 1)
      setState(history[position + 1])
    }
  }, [history, position])

  // 清空历史记录
  const clearHistory = useCallback(() => {
    setHistory([state])
    setPosition(0)
  }, [state])

  // 检查是否可以撤销/重做
  const canUndo = position > 0
  const canRedo = position < history.length - 1

  return {
    state,
    updateState,
    undo,
    redo,
    clearHistory,
    canUndo,
    canRedo,
    historyLength: history.length,
    currentPosition: position,
  }
}
