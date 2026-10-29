"use client"

import { memo, RefObject, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
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
import { Button } from "@workspace/ui/components/button"
import { IconCirclePlusFilled, IconTrash } from "@tabler/icons-react"
import { FieldCertificateType } from "@/CertificateTypes"
import { FieldSnils } from "../field-snils/field-snils"
import { FieldPhone } from "../field-phone/field-phone"
import { EmployeeRequestSchema } from "../../model/types/employee-request.schema"
import { GenericInnerList } from "@/components/form/form-generic-inner-list/form-generic-inner-list"
import { FieldProtocol } from "@/Protocols"

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
  const form = useForm<
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
    form.reset({
      id: data?.id,
      surname: data?.surname,
      name: data?.name,
      patronymic: data?.patronymic,
      birthDate: data?.birthDate,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
      snils: data?.snils,
      hireDate: data?.hireDate,
      firedDate: data?.firedDate,
      berth: data?.berth?.id
        ? { id: data.berth.id, name: data.berth.name }
        : null,
      department: data?.department?.id
        ? { id: data.department.id, name: data.department.name }
        : null,
      certificates: data?.certificates ? [...data?.certificates] : [],
    })
  }, [data, form])

  const onSubmitForm = useCallback(
    async (formData: any) => {
      if (formData) {
        if (!auth?.activeWorkspace?.id) {
          toast.error(JSON.stringify("Не удалось определить workspaceId"))
          return false
        }

        // Отправляем на бэкэнд чистые цифры или строку с маской
        const rawDigits = formData?.snils?.replace(/\D/g, "")

        try {
          if (!employeeId) {
            const result = await dispatch(
              createEmployeeThunk({
                entityData: { ...formData, snils: rawDigits },
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
                entityData: { ...formData, snils: rawDigits },
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
      <form
        id={"employee-details-form"}
        className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit(onSubmitForm, (errors) =>
            toast.error(JSON.stringify(errors))
          )(e)
        }}
      >
        <FieldGroup>
          <FieldInput
            required={true}
            form={form}
            path={"surname"}
            label={"Фамилия"}
            placeholder={"Укажите фамилию"}
          />
          <div className={"grid grid-cols-2 gap-2"}>
            <FieldInput
              form={form}
              path={"name"}
              label={"Имя"}
              placeholder={"Укажите имя"}
            />
            <FieldInput
              form={form}
              path={"patronymic"}
              label={"Отчество"}
              placeholder={"Укажите отчество"}
            />
          </div>
          <div className={"grid grid-cols-2 gap-2"}>
            <FieldDatePicker
              form={form}
              path={"birthDate"}
              label={"Дата рождения"}
            />
            <FieldSnils
              form={form}
              path={"snils"}
              label={"СНИЛС"}
              placeholder={"Укажите СНИЛС"}
            />
          </div>
        </FieldGroup>
        <FieldGroup>
          <FieldDescription>
            {auth.activeWorkspace?.company.name?.toUpperCase()}
          </FieldDescription>
          <Separator />
          <FieldBerth form={form} path={"berth"} label={"Должность"} />
          <FieldDepartment
            form={form}
            path={"department"}
            label={"Подразделение"}
          />
          <div className={"grid grid-cols-2 gap-2"}>
            <FieldDatePicker
              form={form}
              path={"hireDate"}
              label={"Принят на работу"}
            />
          </div>
        </FieldGroup>
        <FieldGroup>
          <FieldDescription>{"Контакты"}</FieldDescription>
          <Separator />
          <div className={"grid grid-cols-2 gap-2"}>
            <FieldPhone
              form={form}
              path={"phoneNumber"}
              label={"Телефон"}
              placeholder={"Укажите телефон"}
            />
            <FieldInput
              form={form}
              path={"email"}
              label={"E-mail"}
              placeholder={"Укажите e-mail"}
            />
          </div>
        </FieldGroup>
        <FieldGroup>
          <GenericInnerList
            name={"certificates"}
            // @ts-ignore
            control={form.control}
            register={form.register}
            formState={form.formState}
            renderItems={(
              subFields,
              { append, remove, insert, getPath, errors }
            ) => (
              <div className={"w-full"}>
                <div className={"flex items-center justify-start gap-2"}>
                  <div className={"text-lg"}>{"Удостоверения"}</div>
                  <Button
                    className={"mt-2 mb-2 w-fit"}
                    variant={"secondary"}
                    type={"button"}
                    onClick={() => {
                      // Добавляем в начало списка
                      append({
                        certificateType: undefined,
                        protocol: undefined,
                        number: "",
                        date: new Date(),
                        group: undefined,
                      })
                    }}
                  >
                    <IconCirclePlusFilled />
                    {"Добавить"}
                  </Button>
                </div>
                <Separator className={"mb-4"} />

                {subFields.map((subField, subIndex) => {
                  return (
                    <div
                      key={subIndex}
                      className={
                        "mb-4 flex w-full flex-col items-start justify-center gap-2"
                      }
                    >
                      <div
                        className={
                          "mb-2 flex flex-row items-center justify-start gap-2"
                        }
                      >
                        <div
                          className={"text-muted-foreground"}
                        >{`Удостоверение # ${subIndex + 1}`}</div>
                        <Button
                          size={"icon"}
                          variant={"destructive"}
                          onClick={() => remove(subIndex)}
                        >
                          <IconTrash className={"text-destructive"} />
                        </Button>
                      </div>
                      <div
                        className={
                          "grid w-full grid-cols-2 gap-2 rounded-lg border p-4"
                        }
                      >
                        <FieldProtocol
                          form={form}
                          path={getPath(subIndex, "protocol")}
                          label={"Протокол"}
                          required={true}
                        />
                        <FieldCertificateType
                          required={true}
                          form={form}
                          path={getPath(subIndex, "certificateType")}
                          label={"Тип"}
                        />
                        <FieldInput
                          required={true}
                          form={form}
                          path={getPath(subIndex, "number")}
                          label={"Номер"}
                        />
                        <FieldDatePicker
                          form={form}
                          path={getPath(subIndex, "date")}
                          label={"Дата"}
                        />
                        {/*{form.watch(getPath(subIndex, "certificateType"))?.id &&*/}
                        {/*  form.watch(getPath(subIndex, "certificateType"))*/}
                        {/*    ?.hasGroups && (*/}
                        {/*    <FieldInput*/}
                        {/*      required={true}*/}
                        {/*      form={form}*/}
                        {/*      path={getPath(subIndex, "group")}*/}
                        {/*      label={"Группа"}*/}
                        {/*      placeholder={"Укажите группу"}*/}
                        {/*    />*/}
                        {/*  )}*/}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          />
        </FieldGroup>

        <input type={"submit"} hidden ref={submitRef} />
      </form>
    </DynamicModuleLoader>
  )
})
