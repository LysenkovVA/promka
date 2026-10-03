"use client"

import { memo, useCallback, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { DynamicModuleLoader, useAppDispatch } from "@/lib/redux"
import { useAuth } from "@/app/(public)/(auth)"
import { toast } from "sonner"
import { BerthType, BerthTypeSchema } from "../../model/types/berth-type.schema"
// import { getBerthTypeDetailsFormData } from "../../model/selectors/berth-type-details.selectors"
import { getBerthTypeByIdThunk } from "../../model/thunks/get-berth-type-by-id.thunk"
import { berthTypeDetailsReducer } from "../../model/slice/berth-type-details.slice"
import { createBerthTypeThunk } from "../../model/thunks/create-berth-type.thunk"
import { updateBerthTypeThunk } from "../../model/thunks/update-berth-type.thunk"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldGroup } from "@workspace/ui/components/field"
import { FieldInput } from "@/components/form/field-input/field-input"

export interface BerthTypeEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  berthTypeId?: string
  onSubmit?: (berth: BerthType) => void
  onClose?: () => void
}

export const BerthTypeEditDialog = memo((props: BerthTypeEditDialogProps) => {
  const { isOpen, onOpenChange, berthTypeId, onClose, onSubmit } = props

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<BerthType>({
    resolver: zodResolver(BerthTypeSchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    if (berthTypeId) {
      dispatch(getBerthTypeByIdThunk({ berthTypeId }))
    }
  }, [berthTypeId, dispatch])

  // useEffect(() => {
  //   if (formData) {
  //     form.reset(formData)
  //   }
  // }, [formData, form])

  const onSubmitCallback = useCallback(
    async (formData: BerthType) => {
      if (formData) {
        if (!auth?.activeWorkspace?.id) {
          toast.error(JSON.stringify("Не удалось определить организацию"))
          return false
        }

        try {
          if (!berthTypeId) {
            const result = await dispatch(
              createBerthTypeThunk({
                entityData: formData,
                workspaceId: auth.activeWorkspace.id,
              })
            ).unwrap()

            if (result.isOk) {
              toast.success("Новый тип должности добавлен", {
                position: "top-center",
                style: {
                  color: "green",
                },
              })
              onSubmit?.(result.data!)
            }
          } else {
            const result = await dispatch(
              updateBerthTypeThunk({
                entityData: formData,
                workspaceId: auth?.activeWorkspace.id,
              })
            ).unwrap()

            if (result.isOk) {
              toast.success("Изменения сохранены", {
                position: "top-center",
                style: {
                  color: "green",
                },
              })
              onSubmit?.(result.data!)
            }
          }
        } catch (error) {
          toast.error((error as string) ?? "Ошибка", {
            position: "top-center",
            style: { color: "tomato" },
          })
        }
      }
    },
    [auth?.activeWorkspace?.id, berthTypeId, dispatch, onSubmit]
  )

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
          <form
            id={"berth-type-details-form"}
            className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}
            onSubmit={form.handleSubmit(onSubmitCallback)}
          >
            <FieldGroup>
              <FieldInput
                required={true}
                form={form}
                path={"name"}
                label={"Тип должности"}
                placeholder={"Укажите должность"}
                description={'Например, "ИТР" или "Рабочий"'}
              />
            </FieldGroup>
            <input type={"submit"} hidden ref={hiddenSubmitInputRef} />
          </form>
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
            <Button variant={"outline"} onClick={onClose}>
              {"Отмена"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DynamicModuleLoader>
  )
})
