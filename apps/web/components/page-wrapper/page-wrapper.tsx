"use client"

import { memo, ReactNode } from "react"

export interface PageWrapperProps {
  children: ReactNode
}

export const PageWrapper = memo((props: PageWrapperProps) => {
  const { children } = props

  return <div className={"w-full p-4"}>{children}</div>
})
