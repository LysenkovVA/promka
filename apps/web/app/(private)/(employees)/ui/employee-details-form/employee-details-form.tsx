"use client"

import { memo, RefObject, useCallback, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Employee } from "../../model/types/employee.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldInput } from "@/components/form/field-input/field-input"
import { FieldDescription, FieldGroup } from "@workspace/ui/components/field"
import { z } from "zod/v4"
import { getEmployeeByIdThunk } from "@/Employees/model/thunks/get-employee-by-id.thunk"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  getEmployeeDetailsData,
  getEmployeeDetailsIsFetching,
  getEmployeeDetailsIsInitialized,
} from "../../model/selectors/employee-details.selectors"
import { toast } from "sonner"
import { createEmployeeThunk } from "../../model/thunks/create-employee.thunk"
import { updateEmployeeThunk } from "../../model/thunks/update-employee.thunk"
import { useAuth } from "@/app/(public)/(auth)"
import { employeeDetailsReducer } from "../../model/slice/employee-details.slice"
import { FieldBerth } from "@/Berthes"
import { FieldDatePicker } from "@/components/form/field-date-picker/field-date-picker"
import { Separator } from "@workspace/ui/components/separator"
import { FieldDepartment } from "@/Departments"
import { FieldPhone } from "../field-phone/field-phone"
import { EmployeeRequestSchema } from "../../model/types/employee-request.schema"
import { FormCollectionPassports } from "@/Passports"
import { FormCollectionSnilses } from "@/Snilses"
import { FormCollectionDiplomas } from "@/Diplomas"
import { FieldCitizenship } from "@/Citizenships"

export interface EmployeeDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  employeeId?: string
  onSubmit?: (data: Employee) => void
}

export const EmployeeDetailsForm = memo((props: EmployeeDetailsFormProps) => {
  const { onSubmit, submitRef, employeeId } = props

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const data = useAppSelector(getEmployeeDetailsData)
  const isInitialized = useAppSelector(getEmployeeDetailsIsInitialized)
  const isLoading = useAppSelector(getEmployeeDetailsIsFetching)

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
    z.input<typeof EmployeeRequestSchema>,
    any,
    z.output<typeof EmployeeRequestSchema>
  >({
    resolver: zodResolver(EmployeeRequestSchema),
  })

  useEffect(() => {
    if (employeeId && !isInitialized && !isLoading) {
      dispatch(getEmployeeByIdThunk({ employeeId: employeeId }))
    }
  }, [dispatch, employeeId, isInitialized, isLoading])

  useEffect(() => {
    methods.reset({
      id: data?.id,
      surname: data?.surname,
      name: data?.name,
      patronymic: data?.patronymic,
      birthDate: data?.birthDate,
      citizenship: data?.citizenship?.id
        ? { id: data.citizenship.id, name: data.citizenship.name }
        : null,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
      hireDate: data?.hireDate,
      firedDate: data?.firedDate,
      berth: data?.berth?.id
        ? { id: data.berth.id, name: data.berth.name }
        : null,
      department: data?.department?.id
        ? { id: data.department.id, name: data.department.name }
        : null,
      passports: data?.passports ? [...data?.passports] : [],
      snilses: data?.snilses ? [...data?.snilses] : [],
      diplomas: data?.diplomas ? [...data?.diplomas] : [],
    })
  }, [data, methods])

  const onSubmitForm = useCallback(
    async (formData: any) => {
      if (formData) {
        if (!auth?.activeWorkspace?.id) {
          toast.error(JSON.stringify("Не удалось определить workspaceId"))
          return false
        }

        // Отправляем на бэкэнд чистые цифры или строку с маской
        // const rawDigits = formData?.snils?.replace(/\D/g, "")
        //@ts-ignore
        const rawDigitsSnilses = formData?.snilses?.map((snils) => {
          return {
            ...snils,
            number: snils?.number?.replace(/\D/g, "") ?? snils?.number,
          }
        })

        try {
          if (!employeeId) {
            const result = await dispatch(
              createEmployeeThunk({
                entityData: { ...formData, snilses: rawDigitsSnilses },
                workspaceId: auth.activeWorkspace.id,
              })
            ).unwrap()

            if (result.isOk) {
              toast.success("Новый сотрудник добавлен", {
                position: "top-center",
                style: {
                  color: "green",
                },
              })
              onSubmit?.(result.data!)
            }
          } else {
            const result = await dispatch(
              updateEmployeeThunk({
                entityData: { ...formData, snilses: rawDigitsSnilses },
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
    [auth?.activeWorkspace?.id, dispatch, employeeId, onSubmit]
  )

  return (
    <DynamicModuleLoader
      reducers={{ employeeDetailsSchema: employeeDetailsReducer }}
      removeAfterUnmount={false}
    >
      {/*Обязательно оборачиваем всю форму в FormProvider*/}
      <FormProvider {...methods}>
        <form
          id={"employee-details-form"}
          className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            methods.handleSubmit(onSubmitForm, (errors) =>
              toast.error(JSON.stringify(errors))
            )(e)
          }}
        >
          <FieldGroup>
            <FieldInput
              required={true}
              name={"surname"}
              label={"Фамилия"}
              placeholder={"Укажите фамилию"}
            />
            <div className={"grid grid-cols-2 gap-2"}>
              <FieldInput
                name={"name"}
                label={"Имя"}
                placeholder={"Укажите имя"}
              />
              <FieldInput
                name={"patronymic"}
                label={"Отчество"}
                placeholder={"Укажите отчество"}
              />
            </div>
            <div className={"grid grid-cols-2 gap-2"}>
              <FieldDatePicker name={"birthDate"} label={"Дата рождения"} />
              <FieldCitizenship
                name={"citizenship"}
                label={"Гражданство"}
                placeholder={"Укажите гражданство"}
              />
            </div>
          </FieldGroup>
          {/* ДОКУМЕНТЫ */}
          <FieldGroup className={"w-full"}>
            <FieldDescription>{"Документы"}</FieldDescription>
            <Separator />
            <FieldGroup>
              <FormCollectionPassports name={"passports"} limit={1} />
              <FormCollectionSnilses name={"snilses"} limit={1} />
              <FormCollectionDiplomas name={"diplomas"} limit={1} />
            </FieldGroup>
          </FieldGroup>
          <FieldGroup>
            <FieldDescription>
              {auth.activeWorkspace?.company.name?.toUpperCase()}
            </FieldDescription>
            <Separator />
            <FieldBerth form={methods} path={"berth"} label={"Должность"} />
            <FieldDepartment
              form={methods}
              path={"department"}
              label={"Подразделение"}
            />
            <div className={"grid grid-cols-2 gap-2"}>
              <FieldDatePicker name={"hireDate"} label={"Принят на работу"} />
            </div>
          </FieldGroup>
          <FieldGroup>
            <FieldDescription>{"Контакты"}</FieldDescription>
            <Separator />
            <div className={"grid grid-cols-2 gap-2"}>
              <FieldPhone
                control={methods.control}
                path={"phoneNumber"}
                label={"Телефон"}
                placeholder={"Укажите телефон"}
              />
              <FieldInput
                name={"email"}
                label={"E-mail"}
                placeholder={"Укажите e-mail"}
              />
            </div>
          </FieldGroup>
          <input type={"submit"} hidden ref={submitRef} />
        </form>
      </FormProvider>
    </DynamicModuleLoader>
  )
})
