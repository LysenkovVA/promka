"use client"

import { memo, useCallback } from "react"
import { Input } from "@workspace/ui/components/input"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import { toast } from "sonner"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  getEmployeeDetailsFormData,
  getEmployeeDetailsIsFetching,
  getEmployeeDetailsIsInitialized,
} from "../../model/selectors/employee-details.selectors"
import { createEmployeeThunk } from "../../model/thunks/create-employee.thunk"
import {
  employeeDetailsActions,
  employeeDetailsReducer,
} from "../../model/slice/employee-details.slice"
import { getAuthData } from "@/app/(public)/(auth)/model/selectors/authSelectors"
import { updateEmployeeThunk } from "../../model/thunks/update-employee.thunk"
import { FieldDatePicker } from "@/components/field-date-picker/field-date-picker"

export interface EditEmployeeSheetProps {
  employeeId?: string
  isOpen: boolean
  handleOpenChange: (isOpen: boolean) => void
}

export const EditEmployeeSheet = memo((props: EditEmployeeSheetProps) => {
  const { employeeId, isOpen, handleOpenChange } = props
  const dispatch = useAppDispatch()
  // const data = useAppSelector(getEmployeeDetailsData)
  const formData = useAppSelector(getEmployeeDetailsFormData)
  const isFetching = useAppSelector(getEmployeeDetailsIsFetching)
  const isInitialized = useAppSelector(getEmployeeDetailsIsInitialized)

  const authData = useAppSelector(getAuthData)

  // useEffect(() => {
  //   if (isOpen && employeeId && !isFetching && !isInitialized) {
  //     // TODO
  //     // dispatch(getEmployeeByIdThunk({ id: employeeId }))
  //   }
  // }, [employeeId, dispatch, isFetching, isInitialized, isOpen])

  const onSubmit = useCallback(async () => {
    if (formData) {
      if (!authData?.activeWorkspaceId) {
        toast.error(JSON.stringify("Не удалось определить workspaceId"))
        return false
      }

      try {
        if (!employeeId) {
          const result = await dispatch(
            createEmployeeThunk({
              entityData: formData,
              workspaceId: authData?.activeWorkspaceId,
            })
          ).unwrap()

          if (result.isOk) {
            toast.success("Новый сотрудник добавлен", {
              position: "top-center",
              style: {
                color: "green",
              },
            })
            handleOpenChange(false)
          }
        } else {
          const result = await dispatch(
            updateEmployeeThunk({
              entityData: formData,
              workspaceId: authData?.activeWorkspaceId,
            })
          ).unwrap()

          if (result.isOk) {
            toast.success("Изменения сохранены", {
              position: "top-center",
              style: {
                color: "green",
              },
            })
            handleOpenChange(false)
          }
        }
      } catch (error) {
        toast.error((error as string) ?? "Ошибка", {
          position: "top-center",
          style: { color: "tomato" },
        })
      }
    }
  }, [
    authData?.activeWorkspaceId,
    dispatch,
    employeeId,
    formData,
    handleOpenChange,
  ])

  return (
    <DynamicModuleLoader
      reducers={{ employeeDetailsSchema: employeeDetailsReducer }}
    >
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <div
                className={
                  "m-auto flex w-fit flex-row items-start justify-start gap-1"
                }
              >
                {formData?.id ? (
                  <div>{formData.name}</div>
                ) : (
                  <div>{"Новый сотрудник"}</div>
                )}
              </div>
            </SheetTitle>
            <SheetDescription>{"Данные сотрудника"}</SheetDescription>
          </SheetHeader>
          <div className="no-scrollbar grid flex-1 auto-rows-min gap-6 overflow-y-auto px-4">
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
            <FieldDatePicker
              label={"Дата рождения"}
              id={"birthDate"}
              value={
                formData?.birthDate ? new Date(formData.birthDate) : undefined
              }
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
            <FieldDatePicker
              label={"Принят на работу"}
              id={"hireDate"}
              value={
                formData?.hireDate ? new Date(formData.hireDate) : undefined
              }
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
          </div>
          <SheetFooter>
            <Button
              type="button"
              onClick={async () => {
                await onSubmit()
              }}
            >
              {"Сохранить"}
            </Button>
            <SheetClose asChild>
              <Button variant={"outline"}>{"Закрыть"}</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </DynamicModuleLoader>
  )
})
