"use client"

import { memo, RefObject, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Workspace } from "../../model/types/workspace.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldInput } from "@/components/form/field-input/field-input"
import { FieldGroup } from "@workspace/ui/components/field"
import { z } from "zod/v4"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"

import { toast } from "sonner"
import { WorkspaceRequestSchema } from "@/Workspaces/model/types/workspace-request.schema"
import {
  getWorkspaceDetailsData,
  getWorkspaceDetailsIsFetching,
  getWorkspaceDetailsIsInitialized,
} from "@/Workspaces/model/selectors/workspace-details-selectors"
import { updateWorkspaceThunk } from "@/Workspaces/model/thunks/update-workspace.thunk"
import { workspaceDetailsReducer } from "@/Workspaces/model/slice/workspace-details-slice"
import { getWorkspaceByIdThunk } from "@/Workspaces/model/thunks/get-workspace-by-id-thunk"
import { createWorkspaceThunk } from "@/Workspaces/model/thunks/create-workspace.thunk"

export interface WorkspaceDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  workspaceId?: string
  onSubmit?: (data: Workspace) => void
}

export const WorkspaceDetailsForm = memo((props: WorkspaceDetailsFormProps) => {
  const { onSubmit, submitRef, workspaceId } = props

  const dispatch = useAppDispatch()
  const data = useAppSelector(getWorkspaceDetailsData)
  const isInitialized = useAppSelector(getWorkspaceDetailsIsInitialized)
  const isLoading = useAppSelector(getWorkspaceDetailsIsFetching)

  /**
   * If your schema uses .default(...) on a field,
   * that field becomes optional on the schema's input type (z.input)
   * but stays required on its output type (z.output/z.infer) —
   * the default only fills it in after validation. Passing a single
   * generic to useForm<T> pins both to the same type and will conflict
   * with zodResolver, which infers input and output separately.
   * Either omit the generic and let it infer from resolver, or specify all three explicitly
   */
  const form = useForm<
    z.input<typeof WorkspaceRequestSchema>,
    any,
    z.output<typeof WorkspaceRequestSchema>
  >({
    resolver: zodResolver(WorkspaceRequestSchema),
  })

  useEffect(() => {
    if (workspaceId && !isInitialized && !isLoading) {
      dispatch(getWorkspaceByIdThunk({ id: workspaceId }))
    }
  }, [dispatch, workspaceId, isInitialized, isLoading])

  useEffect(() => {
    form.reset({
      company: { id: data?.company.id, name: data?.company.name },
    })
  }, [data, form])

  const onSubmitForm = useCallback(
    async (formData: Workspace) => {
      if (formData) {
        try {
          if (!data?.company?.id) {
            const result = await dispatch(
              createWorkspaceThunk({
                entityData: { ...formData },
              })
            ).unwrap()

            if (result.isOk) {
              toast.success("Новая организация добавлена", {
                position: "top-center",
                style: {
                  color: "green",
                },
              })
              onSubmit?.(result.data!)
            }
          } else {
            const result = await dispatch(
              updateWorkspaceThunk({
                entityData: { ...formData },
                workspaceId: workspaceId!,
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
    [data?.company?.id, dispatch, onSubmit, workspaceId]
  )

  return (
    <DynamicModuleLoader
      reducers={{ workspaceDetailsSchema: workspaceDetailsReducer }}
      removeAfterUnmount={false}
    >
      <form
        id={"workspace-details-form"}
        className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit(onSubmitForm, (errors) => {
            if (process.env.NODE_ENV === "development") {
              toast.error(JSON.stringify(errors))
            }
          })(e)
        }}
      >
        <FieldGroup>
          <FieldInput
            required={true}
            form={form}
            path={"company.name"}
            label={"Название организации"}
            placeholder={"Укажите название"}
          />
        </FieldGroup>
        <input type={"submit"} hidden ref={submitRef} />
      </form>
    </DynamicModuleLoader>
  )
})
