"use client"

import { memo, useCallback, useEffect } from "react"
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
import { updateEmployeeThunk } from "@/Employees/model/thunks/update-employee.thunk"

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

  useEffect(() => {
    if (isOpen && employeeId && !isFetching && !isInitialized) {
      // TODO
      // dispatch(getEmployeeByIdThunk({ id: employeeId }))
    }
  }, [employeeId, dispatch, isFetching, isInitialized, isOpen])

  const onSubmit = useCallback(async () => {
    if (formData) {
      if (!authData?.activeWorkspaceId) {
        toast.error(JSON.stringify("Не удалось определить workspaceId"))
        return false
      }

      if (!employeeId) {
        const result = await dispatch(
          createEmployeeThunk({
            entityData: formData,
            workspaceId: authData?.activeWorkspaceId,
          })
        )

        if (result.meta.requestStatus === "fulfilled") {
          toast.success("Новый сотрудник добавлен", { position: "top-center" })
          handleOpenChange(false)
          return true
        } else {
          toast.error(JSON.stringify(result.payload))
        }
        return false
      } else {
        const result = await dispatch(
          updateEmployeeThunk({
            entityData: formData,
            workspaceId: authData?.activeWorkspaceId,
          })
        )

        if (result.meta.requestStatus === "fulfilled") {
          toast.success("Данные сотрудника обновлены", {
            position: "top-center",
          })
          handleOpenChange(false)
          return true
        } else {
          toast.error(JSON.stringify(result.payload))
        }
        return false
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
                  "m-auto flex w-fit flex-row items-center justify-start gap-1"
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
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
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
