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
import { Citizenship } from "../../model/types/citizenship.schema"
import { citizenshipDetailsReducer } from "../../model/slice/citizenship-details.slice"
import { CitizenshipDetailsForm } from "../citizenship-details-form/citizenship-details-form"

export interface CitizenshipEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  citizenshipId?: string
  onSubmit?: (berth: Citizenship) => void
  onClose?: () => void
}

export const CitizenshipEditDialog = memo(
  (props: CitizenshipEditDialogProps) => {
    const { isOpen, onOpenChange, citizenshipId, onClose, onSubmit } = props

    const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

    return (
      <DynamicModuleLoader
        reducers={{ citizenshipDetailsSchema: citizenshipDetailsReducer }}
        removeAfterUnmount={true}
      >
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>
                {citizenshipId ? "Изменение гражданства" : "Новое гражданство"}
              </DialogTitle>
            </DialogHeader>
            <CitizenshipDetailsForm
              submitRef={hiddenSubmitInputRef}
              citizenshipId={citizenshipId}
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
