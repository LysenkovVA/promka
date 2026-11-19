"use client"

import { memo, RefObject, useCallback, useEffect } from "react"
import { useAuth } from "@/app/(public)/(auth)"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { FieldInput } from "@/components/form/field-input/field-input"
import { FieldDatePicker } from "@/components/form/field-date-picker/field-date-picker"
import { FieldGroup } from "@workspace/ui/components/field"
import { FormCollectionStudies } from "@/Studies/ui/form-collection-studies/form-collection-studies"
import { ProtocolRequestSchema } from "../../model/types/protocol-request.schema"
import { getProtocolByIdThunk } from "../../model/thunks/get-protocol-by-id.thunk"
import { protocolDetailsReducer } from "../../model/slice/protocol-details.slice"
import { Protocol } from "../../model/types/protocol.schema"
import { createProtocolThunk } from "../../model/thunks/create-protocol.thunk"
import { updateProtocolThunk } from "../../model/thunks/update-protocol.thunk"
import {
  getProtocolDetailsData,
  getProtocolDetailsIsFetching,
  getProtocolDetailsIsInitialized,
} from "../../model/selectors/protocol-details.selectors"
import { FieldStudyLocation } from "./field-study-location/field-study-location"
import { FieldStudyOrganization } from "@/StudyOrganizations"

export interface ProtocolDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  protocolId?: string
  onSubmit?: (data: Protocol) => void
}

export const ProtocolDetailsForm = memo((props: ProtocolDetailsFormProps) => {
  const { onSubmit, submitRef, protocolId } = props

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const data = useAppSelector(getProtocolDetailsData)
  const isInitialized = useAppSelector(getProtocolDetailsIsInitialized)
  const isLoading = useAppSelector(getProtocolDetailsIsFetching)

  const methods = useForm<
    z.input<typeof ProtocolRequestSchema>,
    any,
    z.output<typeof ProtocolRequestSchema>
  >({
    resolver: zodResolver(ProtocolRequestSchema),
    // Значения по умолчанию для новой записи
    defaultValues: {
      studyLocation: "AT_COMPANY",
      number: "",
      date: new Date(),
      workspace: auth.activeWorkspace,
    },
  })

  useEffect(() => {
    if (protocolId && !isInitialized && !isLoading) {
      dispatch(getProtocolByIdThunk({ protocolId: protocolId }))
    }
  }, [dispatch, protocolId, isInitialized, isLoading])

  useEffect(() => {
    // Инициализируем поля формы только когда загружаются существующие данные
    if (protocolId && isInitialized) {
      methods.reset(data)
    }
  }, [data, isInitialized, methods, protocolId])

  const onSubmitForm = useCallback(
    async (formData: any) => {
      if (formData) {
        if (!auth?.activeWorkspace?.id) {
          toast.error(JSON.stringify("Не удалось определить workspaceId"))
          return false
        }

        try {
          if (!protocolId) {
            const result = await dispatch(
              createProtocolThunk({
                entityData: { ...formData },
                workspaceId: auth.activeWorkspace.id,
              })
            ).unwrap()

            if (result.isOk) {
              toast.success("Новый протокол добавлен", {
                position: "top-center",
                style: {
                  color: "green",
                },
              })
              onSubmit?.(result.data!)
            }
          } else {
            const result = await dispatch(
              updateProtocolThunk({
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
    [auth?.activeWorkspace?.id, dispatch, protocolId, onSubmit]
  )

  return (
    <DynamicModuleLoader
      reducers={{ protocolDetailsSchema: protocolDetailsReducer }}
      removeAfterUnmount={false}
    >
      <FormProvider {...methods}>
        <form
          id={"protocol-details-form"}
          className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            methods.handleSubmit(onSubmitForm, (errors) => {
              if (process.env.NODE_ENV === "development") {
                toast.error(JSON.stringify(errors))
              }
            })(e)
          }}
        >
          <FieldGroup className={"grid grid-cols-2 gap-4"}>
            <FieldStudyLocation
              name={"studyLocation"}
              label={"Место обучения"}
            />
            {methods.watch("studyLocation") === "AT_STUDY_ORGANIZATION" && (
              <FieldStudyOrganization
                name={"studyOrganization"}
                label={"Учебный центр"}
                placeholder={"Укажите учебный центр"}
              />
            )}
          </FieldGroup>
          <FieldGroup className={"grid grid-cols-2 gap-4"}>
            <FieldInput
              name={"number"}
              label={"Номер протокола"}
              placeholder={"Укажите номер протокола"}
              required
            />
            <FieldDatePicker
              name={"date"}
              label={"Дата протокола"}
              placeholder={"Укажите дату протокола"}
              required
            />
          </FieldGroup>
          <FieldGroup>
            <FormCollectionStudies name={"studies"} />
          </FieldGroup>
          <input type={"submit"} hidden ref={submitRef} />
        </form>
      </FormProvider>
    </DynamicModuleLoader>
  )
})
