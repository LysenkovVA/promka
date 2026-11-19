"use client"

import { memo, RefObject, useCallback, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
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
import { useAuth } from "@/app/(public)/(auth)"
import {
  getStudyOrganizationDetailsData,
  getStudyOrganizationDetailsIsFetching,
  getStudyOrganizationDetailsIsInitialized,
} from "../../model/selectors/study-organization-details.selectors"
import {
  StudyOrganization,
  StudyOrganizationSchema,
} from "../../model/types/study-organization.schema"
import { getStudyOrganizationByIdThunk } from "../../model/thunks/get-study-organization-by-id.thunk"
import { createStudyOrganizationThunk } from "../../model/thunks/create-study-organization.thunk"
import { updateStudyOrganizationThunk } from "../../model/thunks/update-study-organization.thunk"
import { studyOrganizationDetailsReducer } from "../../model/slice/study-organization-details.slice"

export interface StudyOrganizationDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  studyOrganizationId?: string
  onSubmit?: (data: StudyOrganization) => void
}

export const StudyOrganizationDetailsForm = memo(
  (props: StudyOrganizationDetailsFormProps) => {
    const { onSubmit, submitRef, studyOrganizationId } = props

    const auth = useAuth()

    const dispatch = useAppDispatch()
    const data = useAppSelector(getStudyOrganizationDetailsData)
    const isInitialized = useAppSelector(
      getStudyOrganizationDetailsIsInitialized
    )
    const isLoading = useAppSelector(getStudyOrganizationDetailsIsFetching)

    /**
     * If your schema uses .default(...) on a field,
     * that field becomes optional on the schema's input type (z.input)
     * but stays required on its output type (z.output/z.infer) —
     * the default only fills it in after validation. Passing a single
     * generic to useForm<T> pins both to the same type and will conflict
     * with zodResolver, which infers input and output separately.
     * Either omit the generic and let it infer from resolver, or specify all three explicitly
     */
    const methods = useForm<
      z.input<typeof StudyOrganizationSchema>,
      any,
      z.output<typeof StudyOrganizationSchema>
    >({
      resolver: zodResolver(StudyOrganizationSchema),
      defaultValues: data,
    })

    useEffect(() => {
      if (studyOrganizationId && !isInitialized && !isLoading) {
        dispatch(
          getStudyOrganizationByIdThunk({
            studyOrganizationId: studyOrganizationId,
          })
        )
      }
    }, [dispatch, studyOrganizationId, isInitialized, isLoading])

    useEffect(() => {
      methods.reset(data)
    }, [data, methods])

    const onSubmitForm = useCallback(
      async (formData: StudyOrganization) => {
        if (formData) {
          if (!auth?.activeWorkspace?.id) {
            toast.error(JSON.stringify("Не удалось определить workspaceId"))
            return false
          }

          try {
            if (!studyOrganizationId) {
              const result = await dispatch(
                createStudyOrganizationThunk({
                  entityData: formData,
                  workspaceId: auth.activeWorkspace.id,
                })
              ).unwrap()

              if (result.isOk) {
                toast.success("Новая образовательная организация добавлена", {
                  position: "top-center",
                  style: {
                    color: "green",
                  },
                })
                onSubmit?.(result.data!)
              }
            } else {
              const result = await dispatch(
                updateStudyOrganizationThunk({
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
      [auth?.activeWorkspace?.id, dispatch, studyOrganizationId, onSubmit]
    )

    return (
      <DynamicModuleLoader
        reducers={{
          studyOrganizationDetailsSchema: studyOrganizationDetailsReducer,
        }}
        removeAfterUnmount={false}
      >
        {/*Обязательно оборачиваем всю форму в FormProvider*/}
        <FormProvider {...methods}>
          <form
            id={"studyOrganization-details-form"}
            className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              methods.handleSubmit(onSubmitForm)(e)
            }}
          >
            <FieldGroup>
              <FieldInput
                required={true}
                name={"name"}
                label={"Название"}
                placeholder={"Укажите название образовательной организации"}
              />
            </FieldGroup>
            <input type={"submit"} hidden ref={submitRef} />
          </form>
        </FormProvider>
      </DynamicModuleLoader>
    )
  }
)
