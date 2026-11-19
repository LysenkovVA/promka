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
import { SpecializationParameter } from "../../model/types/specialization-parameter.schema"
import { specializationParameterDetailsReducer } from "../../model/slice/specialization-parameter-details.slice"
import { SpecializationParameterDetailsForm } from "../specialization-parameter-details-form/specialization-parameter-details-form"

export interface SpecializationParameterEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  specializationParameterId?: string
  onSubmit?: (certificate: SpecializationParameter) => void
  onClose?: () => void
}

export const SpecializationParameterEditDialog = memo(
  (props: SpecializationParameterEditDialogProps) => {
    const {
      isOpen,
      onOpenChange,
      specializationParameterId,
      onClose,
      onSubmit,
    } = props

    const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

    return (
      <DynamicModuleLoader
        reducers={{
          specializationParameterDetailsSchema:
            specializationParameterDetailsReducer,
        }}
        removeAfterUnmount={true}
      >
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>
                {specializationParameterId
                  ? "Изменение типа удостоверения"
                  : "Новый тип удостоверения"}
              </DialogTitle>
            </DialogHeader>
            <SpecializationParameterDetailsForm
              submitRef={hiddenSubmitInputRef}
              specializationParameterId={specializationParameterId}
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
