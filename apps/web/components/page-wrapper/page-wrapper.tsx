"use client"

import { memo, ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface PageWrapperProps {
  children: ReactNode
  className?: string
}

export const PageWrapper = memo((props: PageWrapperProps) => {
  const { children, className } = props

  return <div className={cn(`w-full pr-36 pl-36`, className)}>{children}</div>
})
