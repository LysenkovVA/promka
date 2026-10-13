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
import { CertificateType } from "../../model/types/certificate-type.schema"
import { certificateTypeDetailsReducer } from "../../model/slice/certificate-type-details.slice"
import { CertificateTypeDetailsForm } from "../certificate-type-details-form/certificate-type-details-form"

export interface CertificateTypeEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  certificateTypeId?: string
  onSubmit?: (certificate: CertificateType) => void
  onClose?: () => void
}

export const CertificateTypeEditDialog = memo(
  (props: CertificateTypeEditDialogProps) => {
    const { isOpen, onOpenChange, certificateTypeId, onClose, onSubmit } = props

    const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

    return (
      <DynamicModuleLoader
        reducers={{
          certificateTypeDetailsSchema: certificateTypeDetailsReducer,
        }}
        removeAfterUnmount={true}
      >
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>
                {certificateTypeId
                  ? "Изменение типа удостоверения"
                  : "Новый тип удостоверения"}
              </DialogTitle>
            </DialogHeader>
            <CertificateTypeDetailsForm
              submitRef={hiddenSubmitInputRef}
              certificateTypeId={certificateTypeId}
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
