"use client"

import { memo, useState } from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"

export interface EditSheetProps {
  children?: React.ReactNode
  trigger: React.ReactNode
  side?: "bottom" | "top" | "right" | "left" | undefined
  sheetTitle: React.ReactNode
  sheetDescription: string
  onSubmit: () => Promise<boolean | undefined>
  onOpenChange?: (isOpen: boolean) => void
  submitButtonTitle?: string
  cancelButtonTitle?: string
}

/**
 * @deprecated
 */
export const EditSheet = memo((props: EditSheetProps) => {
  const {
    children,
    trigger,
    side = "right",
    sheetTitle,
    sheetDescription = "",
    onSubmit,
    onOpenChange,
    submitButtonTitle = "Сохранить",
    cancelButtonTitle = "Отмена",
  } = props

  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        onOpenChange?.(open)
      }}
    >
      <SheetTrigger asChild>
        {trigger}
        {/*<Button>{triggerTitle}</Button>*/}
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>{sheetTitle}</SheetTitle>
          <SheetDescription>{sheetDescription}</SheetDescription>
        </SheetHeader>
        {children}
        <SheetFooter>
          <Button
            type="button"
            onClick={async () => {
              if (await onSubmit()) setIsOpen(false)
            }}
          >
            {submitButtonTitle}
          </Button>
          <SheetClose>{cancelButtonTitle}</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
})
