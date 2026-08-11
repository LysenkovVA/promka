"use client"

import { memo } from "react"
import { IconCirclePlus } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"

export interface AppSidebarAddButtonProps {
  title?: string
  onClick?: () => void
}

export const AppSidebarAddButton = memo((props: AppSidebarAddButtonProps) => {
  const { title, onClick } = props

  return (
    <Button
      className={"m-0 flex w-fit flex-row items-center justify-center p-1"}
      size={"icon-xs"}
      variant={"ghost"}
      onClick={onClick}
    >
      <IconCirclePlus className={"size-4"} />
      {title && <div>{title}</div>}
    </Button>
  )
})
