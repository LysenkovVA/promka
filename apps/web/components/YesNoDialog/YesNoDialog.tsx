"use client"

import { memo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"

export interface YesNoDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  content: React.ReactNode
  submitText?: string
  cancelText?: string
  onSubmit?: () => void
  onClose?: () => void
}

export const YesNoDialog = memo((props: YesNoDialogProps) => {
  const {
    isOpen,
    onOpenChange,
    onClose,
    onSubmit,
    title,
    description,
    content,
    submitText = "Да",
    cancelText = "Нет",
  } = props

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/*<DialogTrigger render={<Button variant="outline">Sticky Footer</Button>} />*/}
      <DialogContent>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {content}
        <DialogFooter>
          <Button variant={"default"} onClick={onSubmit}>
            {submitText}
          </Button>
          <Button variant={"outline"} onClick={onClose}>
            {cancelText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
