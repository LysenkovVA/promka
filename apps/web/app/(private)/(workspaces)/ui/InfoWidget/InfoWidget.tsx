"use client"

import { memo } from "react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export interface InfoWidgetProps {
  className?: string
  title: string
  count: number
  onAddClick?: () => void
  children?: React.ReactNode
  onClick?: () => void
}

export const InfoWidget = memo((props: InfoWidgetProps) => {
  const { className, title, count, onAddClick, children, onClick } = props

  return (
    <div
      onClick={onClick}
      className={cn([
        "w-full rounded-lg border border-gray-500 p-1",
        className,
      ])}
    >
      <div className={"flex w-full flex-col items-center justify-center gap-3"}>
        <div style={{ fontSize: 20, fontWeight: "lighter" }}>{title}</div>
        <div style={{ fontSize: 30, fontWeight: "bold" }}>{count}</div>
        {children}
        <Button
          onClick={(e) => {
            e.preventDefault()
            onAddClick?.()
          }}
        >
          {"Добавить"}
        </Button>
      </div>
    </div>
  )
})
