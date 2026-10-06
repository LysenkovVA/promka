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
import { BerthType } from "../../model/types/berth-type.schema"
import { berthTypeDetailsReducer } from "../../model/slice/berth-type-details.slice"
import { BerthTypeDetailsForm } from "../berth-type-details-form/berth-type-details-form"

export interface BerthTypeEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  berthTypeId?: string
  onSubmit?: (berth: BerthType) => void
  onClose?: () => void
}

export const BerthTypeEditDialog = memo((props: BerthTypeEditDialogProps) => {
  const { isOpen, onOpenChange, berthTypeId, onClose, onSubmit } = props

  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <DynamicModuleLoader
      reducers={{ berthTypeDetailsSchema: berthTypeDetailsReducer }}
      removeAfterUnmount={true}
    >
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {berthTypeId ? "Изменение типа должности" : "Новый тип должности"}
            </DialogTitle>
          </DialogHeader>
          <BerthTypeDetailsForm
            submitRef={hiddenSubmitInputRef}
            berthTypeId={berthTypeId}
            onSubmit={(data) => {
              onSubmit?.(data)
              onOpenChange(false)
            }}
          />
          <DialogFooter>
            <Button
              variant={"default"}
              type={"submit"}
              onClick={() => {
                hiddenSubmitInputRef.current?.click()
                // onOpenChange(false)
              }}
            >
              {"Сохранить"}
            </Button>
            <Button
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
