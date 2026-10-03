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
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { berthDetailsReducer } from "../../model/slice/berth-details.slice"
import { Berth, BerthSchema } from "../../model/types/berth.schema"
import { getBerthByIdThunk } from "@/Berthes/model/thunks/get-berth-by-id.thunk"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { IconAsterisk } from "@tabler/icons-react"
import { Textarea } from "@workspace/ui/components/textarea"
import { toast } from "sonner"
import { createBerthThunk } from "@/Berthes/model/thunks/create-berth.thunk"
import { getBerthDetailsData } from "@/Berthes/model/selectors/berth-details.selectors"
import { useAuth } from "@/app/(public)/(auth)"
import { updateBerthThunk } from "@/Berthes/model/thunks/update-berth.thunk"
import { FieldBerthType } from "@/BerthTypes/ui/field-berth-type/field-berth-type"

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
  const data = useAppSelector(getBerthDetailsData)
  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<Berth>({
    resolver: zodResolver(BerthSchema),
    defaultValues: {
      name: "",
      berthType: null,
    },
  })

  useEffect(() => {
    if (berthId) {
      dispatch(getBerthByIdThunk({ berthId }))
    }
  }, [berthId, dispatch])

  useEffect(() => {
    if (data) {
      form.reset(data)
    }
  }, [data, form, form.reset])

  const onSubmitCallback = useCallback(
    async (formData: Berth) => {
      if (formData) {
        if (!auth?.activeWorkspace?.id) {
          toast.error(JSON.stringify("Не удалось определить организацию"))
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
    },
    [auth?.activeWorkspace?.id, berthId, dispatch, onSubmit]
  )

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
          </DialogHeader>
          <form
            id={"berth-type-details-form"}
            className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}
            onSubmit={form.handleSubmit(onSubmitCallback)}
          >
            <FieldGroup>
              <FieldBerthType form={form} path={"berthType"} label={"Тип"} />
              {/*<Controller*/}
              {/*  control={control}*/}
              {/*  name={"berthType"}*/}
              {/*  render={({ field, fieldState }) => (*/}
              {/*    <Field aria-invalid={fieldState.invalid} className={"w-fit"}>*/}
              {/*      <FieldLabel>*/}
              {/*        <div*/}
              {/*          className={*/}
              {/*            "flex w-full items-center justify-start gap-1"*/}
              {/*          }*/}
              {/*        >*/}
              {/*          {"Тип"}*/}
              {/*          <IconAsterisk className={"size-2 text-destructive"} />*/}
              {/*        </div>*/}
              {/*      </FieldLabel>*/}
              {/*      <BerthTypeSelector*/}
              {/*        value={field.value ?? null}*/}
              {/*        onChange={(e) => {*/}
              {/*          field.onChange(e)*/}
              {/*          // onChange?.(e)*/}
              {/*        }}*/}
              {/*      />*/}
              {/*      {fieldState.invalid && (*/}
              {/*        <FieldError errors={[fieldState.error]} />*/}
              {/*      )}*/}
              {/*    </Field>*/}
              {/*  )}*/}
              {/*/>*/}
              <Controller
                {...form.register("name")}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel>
                      <div
                        className={
                          "flex w-full items-center justify-start gap-1"
                        }
                      >
                        {"Название"}
                        <IconAsterisk className={"size-2 text-destructive"} />
                      </div>
                    </FieldLabel>
                    <Textarea
                      className={"min-h-[100px]"}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e)
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
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
