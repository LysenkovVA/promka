"use client"

import { memo, RefObject, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
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
  getCertificateTypeDetailsData,
  getCertificateTypeDetailsIsFetching,
  getCertificateTypeDetailsIsInitialized,
} from "../../model/selectors/certificate-type-details.selectors"
import {
  CertificateType,
  CertificateTypeSchema,
} from "../../model/types/certificate-type.schema"
import { getCertificateTypeByIdThunk } from "../../model/thunks/get-certificate-type-by-id.thunk"
import { createCertificateTypeThunk } from "../../model/thunks/create-certificate-type.thunk"
import { updateCertificateTypeThunk } from "../../model/thunks/update-certificate-type.thunk"
import { certificateTypeDetailsReducer } from "../../model/slice/certificate-type-details.slice"
import { FieldSwitch } from "@/components/form/field-switch/field-switch"
import { FieldDuration } from "@/CertificateTypes/ui/field-duration/field-duration"

export interface CertificateTypeDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  certificateTypeId?: string
  onSubmit?: (data: CertificateType) => void
}

export const CertificateTypeDetailsForm = memo(
  (props: CertificateTypeDetailsFormProps) => {
    const { onSubmit, submitRef, certificateTypeId } = props

    const auth = useAuth()

    const dispatch = useAppDispatch()
    const data = useAppSelector(getCertificateTypeDetailsData)
    const isInitialized = useAppSelector(getCertificateTypeDetailsIsInitialized)
    const isLoading = useAppSelector(getCertificateTypeDetailsIsFetching)

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
      z.input<typeof CertificateTypeSchema>,
      any,
      z.output<typeof CertificateTypeSchema>
    >({
      resolver: zodResolver(CertificateTypeSchema),
      defaultValues: data,
    })

    useEffect(() => {
      if (certificateTypeId && !isInitialized && !isLoading) {
        dispatch(
          getCertificateTypeByIdThunk({ certificateTypeId: certificateTypeId })
        )
      }
    }, [dispatch, certificateTypeId, isInitialized, isLoading])

    useEffect(() => {
      form.reset(data)
    }, [data, form])

    const onSubmitForm = useCallback(
      async (formData: CertificateType) => {
        if (formData) {
          if (!auth?.activeWorkspace?.id) {
            toast.error(JSON.stringify("Не удалось определить workspaceId"))
            return false
          }

          try {
            if (!certificateTypeId) {
              const result = await dispatch(
                createCertificateTypeThunk({
                  entityData: formData,
                  workspaceId: auth.activeWorkspace.id,
                })
              ).unwrap()

              if (result.isOk) {
                toast.success("Новый тип удостоверения добавлен", {
                  position: "top-center",
                  style: {
                    color: "green",
                  },
                })
                onSubmit?.(result.data!)
              }
            } else {
              const result = await dispatch(
                updateCertificateTypeThunk({
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
      [auth?.activeWorkspace?.id, dispatch, certificateTypeId, onSubmit]
    )

    return (
      <DynamicModuleLoader
        reducers={{
          certificateTypeDetailsSchema: certificateTypeDetailsReducer,
        }}
        removeAfterUnmount={false}
      >
        <form
          id={"certificate-type-details-form"}
          className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit(onSubmitForm)(e)
          }}
        >
          <FieldGroup>
            <FieldInput
              required={true}
              form={form}
              path={"name"}
              label={"Название"}
              placeholder={"Укажите название типа удостоверения"}
              // description={'Например, "ИТР" или "Рабочий"'}
            />
            <FieldSwitch
              form={form}
              path={"hasGroups"}
              label={"Есть группы"}
              description={
                "Выберите эту опцию, если у типа удостоверения есть группы"
              }
            />
            <FieldDuration
              form={form}
              path={"durationAtMonths"}
              label={"Срок действия"}
              description={"Укажите срок действия типа удостоверения"}
            />
          </FieldGroup>
          <input type={"submit"} hidden ref={submitRef} />
        </form>
      </DynamicModuleLoader>
    )
  }
)
