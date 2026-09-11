"use client"

import { memo, useCallback, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  berthDetailsActions,
  berthDetailsReducer,
} from "../../model/slice/berth-details.slice"
import { Berth } from "../../model/types/berth.schema"
import { getBerthByIdThunk } from "@/Berthes/model/thunks/get-berth-by-id.thunk"
import { getBerthDetailsFormData } from "@/Berthes/model/selectors/berth-details.selectors"
import { useAuth } from "@/app/(public)/(auth)"
import { toast } from "sonner"
import { createBerthThunk } from "@/Berthes/model/thunks/create-berth.thunk"
import { updateBerthThunk } from "@/Berthes/model/thunks/update-berth.thunk"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

export interface BerthEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  berthId?: string
  onSubmit?: (berth: Berth) => void
  onClose?: () => void
}

export const BerthEditDialog = memo((props: BerthEditDialogProps) => {
  const { isOpen, onOpenChange, berthId, onClose, onSubmit } = props

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const formData = useAppSelector(getBerthDetailsFormData)

  useEffect(() => {
    if (berthId) {
      dispatch(getBerthByIdThunk({ berthId }))
    }
  }, [berthId, dispatch])

  const onSubmitCallback = useCallback(async () => {
    if (formData) {
      if (!auth?.activeWorkspace?.id) {
        toast.error(JSON.stringify("Не удалось определить workspaceId"))
        return false
      }

      try {
        if (!berthId) {
          const result = await dispatch(
            createBerthThunk({
              entityData: formData,
              workspaceId: auth.activeWorkspace.id,
            })
          ).unwrap()

          if (result.isOk) {
            toast.success("Новая должность добавлена", {
              position: "top-center",
              style: {
                color: "green",
              },
            })
            onSubmit?.(result.data!)
          }
        } else {
          const result = await dispatch(
            updateBerthThunk({
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
  }, [auth.activeWorkspace.id, berthId, dispatch, formData, onSubmit])

  return (
    <DynamicModuleLoader
      reducers={{ berthDetailsSchema: berthDetailsReducer }}
      removeAfterUnmount={true}
    >
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {berthId ? "Изменение должности" : "Новая должность"}
            </DialogTitle>
            {/*{description && (*/}
            {/*  <DialogDescription>{description}</DialogDescription>*/}
            {/*)}*/}
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="name">{"Название"}</FieldLabel>
            <Input
              id="name"
              value={formData?.name ?? ""}
              onChange={(e) =>
                dispatch(
                  berthDetailsActions.setFormData({
                    data: { ...formData!, name: e.target.value },
                  })
                )
              }
            />
          </Field>
          <DialogFooter>
            <Button
              variant={"default"}
              onClick={async () => {
                await onSubmitCallback()
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
