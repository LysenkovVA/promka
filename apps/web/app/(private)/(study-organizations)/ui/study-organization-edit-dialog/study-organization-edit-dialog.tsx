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
import { StudyOrganization } from "../../model/types/study-organization.schema"
import { studyOrganizationDetailsReducer } from "../../model/slice/study-organization-details.slice"
import { StudyOrganizationDetailsForm } from "../study-organization-details-form/study-organization-details-form"

export interface StudyOrganizationEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  studyOrganizationId?: string
  onSubmit?: (berth: StudyOrganization) => void
  onClose?: () => void
}

export const StudyOrganizationEditDialog = memo(
  (props: StudyOrganizationEditDialogProps) => {
    const { isOpen, onOpenChange, studyOrganizationId, onClose, onSubmit } =
      props

    const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

    return (
      <DynamicModuleLoader
        reducers={{
          studyOrganizationDetailsSchema: studyOrganizationDetailsReducer,
        }}
        removeAfterUnmount={true}
      >
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>
                {studyOrganizationId
                  ? "Изменение образовательной организации"
                  : "Новая образовательная организация"}
              </DialogTitle>
            </DialogHeader>
            <StudyOrganizationDetailsForm
              submitRef={hiddenSubmitInputRef}
              studyOrganizationId={studyOrganizationId}
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
