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
import { SpecializationDirection } from "../../model/types/specialization-direction.schema"
import { specializationDirectionDetailsReducer } from "../../model/slice/specialization-direction-details.slice"
import { SpecializationDirectionDetailsForm } from "../specialization-direction-details-form/specialization-direction-details-form"

export interface SpecializationDirectionEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  specializationDirectionId?: string
  onSubmit?: (certificate: SpecializationDirection) => void
  onClose?: () => void
}

export const SpecializationDirectionEditDialog = memo(
  (props: SpecializationDirectionEditDialogProps) => {
    const {
      isOpen,
      onOpenChange,
      specializationDirectionId,
      onClose,
      onSubmit,
    } = props

    const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

    return (
      <DynamicModuleLoader
        reducers={{
          specializationDirectionDetailsSchema:
            specializationDirectionDetailsReducer,
        }}
        removeAfterUnmount={true}
      >
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>
                {specializationDirectionId
                  ? "Изменение типа удостоверения"
                  : "Новый тип удостоверения"}
              </DialogTitle>
            </DialogHeader>
            <SpecializationDirectionDetailsForm
              submitRef={hiddenSubmitInputRef}
              specializationDirectionId={specializationDirectionId}
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
