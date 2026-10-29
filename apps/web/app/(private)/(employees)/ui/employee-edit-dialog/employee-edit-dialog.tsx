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
import { Employee } from "../../model/types/employee.schema"
import { employeeDetailsReducer } from "../../model/slice/employee-details.slice"
import { EmployeeDetailsSimpleForm } from "../employee-details-simple-form/employee-details-simple-form"

export interface EmployeeEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  employeeId?: string
  onSubmit?: (certificate: Employee) => void
  onClose?: () => void
}

export const EmployeeEditDialog = memo((props: EmployeeEditDialogProps) => {
  const { isOpen, onOpenChange, employeeId, onClose, onSubmit } = props

  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <DynamicModuleLoader
      reducers={{
        employeeDetailsSchema: employeeDetailsReducer,
      }}
      removeAfterUnmount={true}
    >
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {employeeId ? "Изменение сотрудника" : "Новый сотрудник"}
            </DialogTitle>
          </DialogHeader>
          <EmployeeDetailsSimpleForm
            submitRef={hiddenSubmitInputRef}
            employeeId={employeeId}
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
