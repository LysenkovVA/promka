"use client"

import { memo, RefObject, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Certificate } from "../../model/types/certificate.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldInput } from "@/components/form/field-input/field-input"
import { FieldGroup } from "@workspace/ui/components/field"
import { z } from "zod/v4"
import { getCertificateByIdThunk } from "@/Certificates/model/thunks/get-certificate-by-id.thunk"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  getCertificateDetailsData,
  getCertificateDetailsIsFetching,
  getCertificateDetailsIsInitialized,
} from "../../model/selectors/certificate-details.selectors"
import { toast } from "sonner"
import { createCertificateThunk } from "../../model/thunks/create-certificate.thunk"
import { updateCertificateThunk } from "../../model/thunks/update-certificate.thunk"
import { useAuth } from "@/app/(public)/(auth)"
import { certificateDetailsReducer } from "../../model/slice/certificate-details.slice"
import { FieldDatePicker } from "@/components/form/field-date-picker/field-date-picker"
import { FieldEmployee } from "@/Employees"
import { FieldCertificateType } from "@/CertificateTypes"
import { CertificateRequestSchema } from "@/Certificates/model/types/certificate-request.schema"
import { FieldProtocol } from "@/Protocols/ui/field-protocol/field-protocol"

export interface CertificateDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  certificateId?: string
  onSubmit?: (data: Certificate) => void
}

export const CertificateDetailsForm = memo(
  (props: CertificateDetailsFormProps) => {
    const { onSubmit, submitRef, certificateId } = props

    const auth = useAuth()

    const dispatch = useAppDispatch()
    const data = useAppSelector(getCertificateDetailsData)
    const isInitialized = useAppSelector(getCertificateDetailsIsInitialized)
    const isLoading = useAppSelector(getCertificateDetailsIsFetching)

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
      z.input<typeof CertificateRequestSchema>,
      any,
      z.output<typeof CertificateRequestSchema>
    >({
      resolver: zodResolver(CertificateRequestSchema),
      defaultValues: {},
    })

    useEffect(() => {
      if (certificateId && !isInitialized && !isLoading) {
        dispatch(getCertificateByIdThunk({ certificateId: certificateId }))
      }
    }, [dispatch, certificateId, isInitialized, isLoading])

    useEffect(() => {
      form.reset({
        id: data?.id,
        number: data?.number,
        date: data?.date,
        group: data?.group,
        certificateType: {
          id: data?.certificateType?.id!,
          name: data?.certificateType.name,
        },
        employee: {
          id: data?.employee.id!,
          surname: data?.employee.surname,
          name: data?.employee.name,
          patronymic: data?.employee.patronymic,
        },
        protocol: {
          id: data?.protocol?.id!,
          number: data?.protocol?.number,
          date: data?.protocol?.date,
        },
      })
    }, [data, form])

    const onSubmitForm = useCallback(
      async (formData: any) => {
        if (formData) {
          if (!auth?.activeWorkspace?.id) {
            toast.error(JSON.stringify("Не удалось определить workspaceId"))
            return false
          }

          try {
            if (!certificateId) {
              const result = await dispatch(
                createCertificateThunk({
                  entityData: { ...formData },
                  workspaceId: auth.activeWorkspace.id,
                })
              ).unwrap()

              if (result.isOk) {
                toast.success("Новое удостоверение добавлено", {
                  position: "top-center",
                  style: {
                    color: "green",
                  },
                })
                onSubmit?.(result.data!)
              }
            } else {
              const result = await dispatch(
                updateCertificateThunk({
                  entityData: { ...formData },
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
      [auth?.activeWorkspace?.id, dispatch, certificateId, onSubmit]
    )

    return (
      <DynamicModuleLoader
        reducers={{ certificateDetailsSchema: certificateDetailsReducer }}
        removeAfterUnmount={false}
      >
        <form
          id={"certificate-details-form"}
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
            <div className={"grid grid-cols-2 gap-2"}>
              <FieldInput
                required={true}
                form={form}
                path={"number"}
                label={"Номер"}
                placeholder={"Укажите номер"}
              />
              <FieldDatePicker form={form} path={"date"} label={"Дата"} />
              <FieldCertificateType
                required={true}
                form={form}
                path={"certificateType"}
                label={"Тип"}
              />
              <FieldEmployee
                form={form}
                path={"employee"}
                label={"Кому принадлежит"}
                required={true}
              />
              <FieldProtocol
                form={form}
                path={"protocol"}
                label={"Протокол"}
                required={true}
              />
            </div>
          </FieldGroup>
          <input type={"submit"} hidden ref={submitRef} />
        </form>
      </DynamicModuleLoader>
    )
  }
)
