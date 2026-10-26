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
import { Protocol } from "@/Protocols"
import { protocolDetailsReducer } from "@/Protocols/model/slice/protocol-details.slice"
import { ProtocolDetailsForm } from "@/Protocols/ui/protocol-details-form/protocol-details-form"

export interface ProtocolEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  protocolId?: string
  onSubmit?: (certificate: Protocol) => void
  onClose?: () => void
}

export const ProtocolEditDialog = memo((props: ProtocolEditDialogProps) => {
  const { isOpen, onOpenChange, protocolId, onClose, onSubmit } = props

  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <DynamicModuleLoader
      reducers={{
        protocolDetailsSchema: protocolDetailsReducer,
      }}
      removeAfterUnmount={true}
    >
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {protocolId ? "Изменение протокола" : "Новый протокол"}
            </DialogTitle>
          </DialogHeader>
          <ProtocolDetailsForm
            submitRef={hiddenSubmitInputRef}
            protocolId={protocolId}
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
