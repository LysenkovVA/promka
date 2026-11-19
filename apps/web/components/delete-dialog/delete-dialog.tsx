"use client"

import React, { memo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { Button } from "@workspace/ui/components/button"

export interface DeleteDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  deleteMessage: string
  onOk: () => void
  onCancel: () => void
}

export const DeleteDialog = memo((props: DeleteDialogProps) => {
  const { isOpen, onOpenChange, deleteMessage, onOk, onCancel } = props

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{"Удаление"}</DialogTitle>
          <DialogDescription>{deleteMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <ButtonGroup>
            <Button
              variant={"secondary"}
              type={"button"}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onCancel()
              }}
            >
              {"Отмена"}
            </Button>
            <Button
              variant={"destructive"}
              type={"button"}
              onClick={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                onOk()
              }}
            >
              {"Удалить"}
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
