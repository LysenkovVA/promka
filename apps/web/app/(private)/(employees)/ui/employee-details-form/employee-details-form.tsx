"use client"

import { memo } from "react"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { employeeDetailsActions } from "@/Employees/model/slice/employee-details.slice"
import { useAppDispatch, useAppSelector } from "@/lib/redux"
import { FieldDatePicker } from "@/components/field-date-picker/field-date-picker"
import { FieldBerth } from "@/Berthes"
import { Separator } from "@workspace/ui/components/separator"
import { getEmployeeDetailsFormData } from "@/Employees/model/selectors/employee-details.selectors"

export interface EmployeeDetailsFormProps {}

export const EmployeeDetailsForm = memo((props: EmployeeDetailsFormProps) => {
  const {} = props

  const dispatch = useAppDispatch()
  const formData = useAppSelector(getEmployeeDetailsFormData)

  return (
    <div className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}>
      <FieldSet className={"w-full"}>
        {/*<FieldLegend>{"Данные о сотруднике"}</FieldLegend>*/}
        <FieldDescription>{"Персональные данные"}</FieldDescription>
        <Field>
          <FieldLabel htmlFor="surname">Фамилия</FieldLabel>
          <Input
            id="surname"
            value={formData?.surname ?? ""}
            onChange={(e) =>
              dispatch(
                employeeDetailsActions.setFormData({
                  data: { ...formData!, surname: e.target.value },
                })
              )
            }
          />
        </Field>
        <div className={"grid grid-cols-2 gap-4"}>
          <Field>
            <FieldLabel htmlFor="name">Имя</FieldLabel>
            <Input
              id="name"
              value={formData?.name ?? ""}
              onChange={(e) =>
                dispatch(
                  employeeDetailsActions.setFormData({
                    data: { ...formData!, name: e.target.value },
                  })
                )
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="patronymic">Отчество</FieldLabel>
            <Input
              id="patronymic"
              value={formData?.patronymic ?? ""}
              onChange={(e) =>
                dispatch(
                  employeeDetailsActions.setFormData({
                    data: { ...formData!, patronymic: e.target.value },
                  })
                )
              }
            />
          </Field>
        </div>
        <FieldDatePicker
          label={"Дата рождения"}
          id={"birthDate"}
          value={formData?.birthDate ? new Date(formData.birthDate) : undefined}
          onChange={(e) => {
            dispatch(
              employeeDetailsActions.setFormData({
                data: { ...formData!, birthDate: e },
              })
            )
          }}
        />
        <Field>
          <FieldLabel htmlFor="snils">СНИЛС</FieldLabel>
          <Input
            id="snils"
            value={formData?.snils ?? ""}
            onChange={(e) =>
              dispatch(
                employeeDetailsActions.setFormData({
                  data: { ...formData!, snils: e.target.value },
                })
              )
            }
          />
        </Field>
      </FieldSet>
      <FieldSet className={"w-full"}>
        <FieldDescription>{"Рабочая информация"}</FieldDescription>
        <Separator />
        {formData?.workspace?.company.id && (
          <Field className={"w-fit"}>
            <FieldLabel>{"Организация"}</FieldLabel>
            <div className={"m-auto w-fit"}>
              {formData?.workspace?.company.name}
            </div>
          </Field>
        )}
        <FieldBerth
          label={"Должность"}
          id={"berth"}
          value={formData?.berth ?? undefined}
          onChange={(selectedValue) => {
            dispatch(
              employeeDetailsActions.setFormData({
                data: { ...formData!, berth: selectedValue },
              })
            )
            // dispatch(berthesActions.setSearch(""))
          }}
        />
        <div className={"grid grid-cols-2 gap-4"}>
          <FieldDatePicker
            label={"Принят на работу"}
            id={"hireDate"}
            value={formData?.hireDate ? new Date(formData.hireDate) : undefined}
            onChange={(e) => {
              dispatch(
                employeeDetailsActions.setFormData({
                  data: { ...formData!, hireDate: e },
                })
              )
            }}
          />
          <FieldDatePicker
            label={"Уволен"}
            id={"firedDate"}
            value={
              formData?.firedDate ? new Date(formData.firedDate) : undefined
            }
            onChange={(e) => {
              dispatch(
                employeeDetailsActions.setFormData({
                  data: { ...formData!, firedDate: e },
                })
              )
            }}
          />
        </div>
      </FieldSet>
      <FieldSet className={"w-full"}>
        <FieldDescription>{"Контакты"}</FieldDescription>
        <Separator />
        <Field>
          <FieldLabel htmlFor="phoneNumber">Телефон</FieldLabel>
          <Input
            id="phoneNumber"
            value={formData?.phoneNumber ?? ""}
            onChange={(e) =>
              dispatch(
                employeeDetailsActions.setFormData({
                  data: { ...formData!, phoneNumber: e.target.value },
                })
              )
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            value={formData?.email ?? ""}
            onChange={(e) =>
              dispatch(
                employeeDetailsActions.setFormData({
                  data: { ...formData!, email: e.target.value },
                })
              )
            }
          />
        </Field>
      </FieldSet>
    </div>
  )
})
