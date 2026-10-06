"use client"

import { memo, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { DynamicModuleLoader } from "@/lib/redux"
import { berthDetailsReducer } from "../../model/slice/berth-details.slice"
import { Berth } from "../../model/types/berth.schema"
import { BerthDetailsForm } from "@/Berthes/ui/berth-details-form/berth-details-form"

export interface BerthEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  berthId?: string
  onSubmit?: (berth: Berth) => void
  onClose?: () => void
}

export const BerthEditDialog = memo((props: BerthEditDialogProps) => {
  const { isOpen, onOpenChange, berthId, onClose, onSubmit } = props

  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <DynamicModuleLoader
      reducers={{ berthDetailsSchema: berthDetailsReducer }}
      removeAfterUnmount={true}
    >
      n
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {berthId ? "Изменение должности" : "Новая должность"}
            </DialogTitle>
          </DialogHeader>
          <BerthDetailsForm
            submitRef={hiddenSubmitInputRef}
            berthId={berthId}
            onSubmit={(data) => {
              onSubmit?.(data)
              onOpenChange(false)
            }}
          />
          <DialogFooter>
            <Button
              variant={"default"}
              onClick={() => {
                hiddenSubmitInputRef.current?.click()
                // onOpenChange(false)
              }}
            >
              {"Сохранить"}
            </Button>
            <Button
              type={"button"}
              variant={"outline"}
              onClick={() => {
                onClose?.()
                onOpenChange(false)
              }}
            >
              {"Отмена"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DynamicModuleLoader>
  )
})
