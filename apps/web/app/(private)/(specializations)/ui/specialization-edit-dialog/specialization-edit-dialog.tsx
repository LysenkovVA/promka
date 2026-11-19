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
import { Specialization } from "../../model/types/specialization.schema"
import { specializationDetailsReducer } from "../../model/slice/specialization-details.slice"
import { SpecializationDetailsForm } from "../specialization-details-form/specialization-details-form"

export interface SpecializationEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  specializationId?: string
  onSubmit?: (certificate: Specialization) => void
  onClose?: () => void
}

export const SpecializationEditDialog = memo(
  (props: SpecializationEditDialogProps) => {
    const { isOpen, onOpenChange, specializationId, onClose, onSubmit } = props

    const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

    return (
      <DynamicModuleLoader
        reducers={{
          specializationDetailsSchema: specializationDetailsReducer,
        }}
        removeAfterUnmount={true}
      >
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent showCloseButton={false} className={"min-w-1/2"}>
            <DialogHeader>
              <DialogTitle>
                {specializationId
                  ? "Изменение типа удостоверения"
                  : "Новый тип удостоверения"}
              </DialogTitle>
            </DialogHeader>
            <SpecializationDetailsForm
              submitRef={hiddenSubmitInputRef}
              specializationId={specializationId}
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
  }
)
