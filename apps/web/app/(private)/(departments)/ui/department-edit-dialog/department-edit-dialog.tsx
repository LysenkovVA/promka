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
import { Department } from "../../model/types/department.schema"
import { departmentDetailsReducer } from "../../model/slice/department-details.slice"
import { DepartmentDetailsForm } from "../department-details-form/department-details-form"

export interface DepartmentEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  departmentId?: string
  onSubmit?: (berth: Department) => void
  onClose?: () => void
}

export const DepartmentEditDialog = memo((props: DepartmentEditDialogProps) => {
  const { isOpen, onOpenChange, departmentId, onClose, onSubmit } = props

  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <DynamicModuleLoader
      reducers={{ departmentDetailsSchema: departmentDetailsReducer }}
      removeAfterUnmount={true}
    >
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {departmentId ? "Изменение подразделения" : "Новое подразделение"}
            </DialogTitle>
          </DialogHeader>
          <DepartmentDetailsForm
            submitRef={hiddenSubmitInputRef}
            departmentId={departmentId}
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
