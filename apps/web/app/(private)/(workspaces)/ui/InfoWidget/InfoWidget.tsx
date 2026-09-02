"use client"

import { memo } from "react"
import { Button } from "@workspace/ui/components/button"

export interface InfoWidgetProps {
  title: string
  count: number
  onAddClick?: () => void
  children?: React.ReactNode
}

export const InfoWidget = memo((props: InfoWidgetProps) => {
  const { title, count, onAddClick, children } = props

  return (
    <div className={"w-full rounded-lg border border-gray-500 p-1"}>
      <div className={"flex w-full flex-col items-center justify-center gap-3"}>
        <div style={{ fontSize: 20, fontWeight: "lighter" }}>{title}</div>
        <div style={{ fontSize: 30, fontWeight: "bold" }}>{count}</div>
        {children}
        <Button onClick={onAddClick}>{"Добавить"}</Button>
      </div>
    </div>
  )
})
