"use client"

import { memo } from "react"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { Button } from "@workspace/ui/components/button"
import { IconArrowLeft, IconEditFilled } from "@tabler/icons-react"
import { Separator } from "@workspace/ui/components/separator"
import { useRouter } from "next/navigation"

export interface DetailsHeaderProps {
  children?: React.ReactNode
  onEditClick?: () => void
}

export const DetailsHeader = memo((props: DetailsHeaderProps) => {
  const { children, onEditClick } = props

  const router = useRouter()

  return (
    <>
      <div className={"flex flex-row items-center justify-between gap-3"}>
        <ButtonGroup>
          <Button
            variant="outline"
            aria-label="Go Back"
            onClick={() => router.back()}
          >
            <IconArrowLeft />
            {"Назад"}
          </Button>
        </ButtonGroup>
        <ButtonGroup className={"gap-1"}>
          <Button variant={"ghost"} onClick={onEditClick}>
            <IconEditFilled />
            {"Изменить"}
          </Button>
        </ButtonGroup>
      </div>
      <Separator />
      {children}
    </>
  )
})
