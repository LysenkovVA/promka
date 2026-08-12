"use client"

import { memo, useCallback, useEffect } from "react"
import { Input } from "@workspace/ui/components/input"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  employeeDetailsActions,
  employeeDetailsReducer,
} from "@/app/(private)/(companies)/model/slice/employee-details-slice"
import {
  getEmployeeDetailsData,
  getEmployeeDetailsFormData,
  getEmployeeDetailsIsFetching,
  getEmployeeDetailsIsInitialized,
} from "@/app/(private)/(companies)/model/selectors/employee-details-selectors"
import { getEmployeeByIdThunk } from "@/app/(private)/(companies)/model/thunks/get-employee-by-id-thunk"
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
import { upsertEmployeeThunk } from "@/app/(private)/(companies)/model/thunks/upsert-employee-thunk"
import { toast } from "sonner"
import {
  Field,
  FieldLabel,
  FieldSeparator,
} from "@workspace/ui/components/field"

export interface EditEmployeeSheetProps {
  employeeId?: string
  isOpen: boolean
  handleOpenChange: (isOpen: boolean) => void
  // onSubmit: () => void
}

export const EditEmployeeSheet = memo((props: EditEmployeeSheetProps) => {
  const { employeeId, isOpen, handleOpenChange } = props
  const dispatch = useAppDispatch()
  const data = useAppSelector(getEmployeeDetailsData)
  const formData = useAppSelector(getEmployeeDetailsFormData)
  const isFetching = useAppSelector(getEmployeeDetailsIsFetching)
  const isInitialized = useAppSelector(getEmployeeDetailsIsInitialized)

  useEffect(() => {
    if (isOpen && employeeId && !isFetching && !isInitialized) {
      dispatch(getEmployeeByIdThunk({ id: employeeId }))
    }
  }, [employeeId, dispatch, isFetching, isInitialized, isOpen])

  const onSubmit = useCallback(async () => {
    if (formData) {
      const result = await dispatch(
        upsertEmployeeThunk({ entityData: formData })
      )

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Изменения сохранены", { position: "top-center" })
        handleOpenChange(false)
        return true
      } else {
        toast.error(JSON.stringify(result.payload))
      }
      return false
    }
  }, [dispatch, formData, handleOpenChange])

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
                {data?.id ? (
                  <div>{data.name}</div>
                ) : (
                  <div>{"Новая организация"}</div>
                )}
              </div>
            </SheetTitle>
            <SheetDescription>{"Данные организации"}</SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <Field>
              <FieldLabel htmlFor="sheet-name">Название</FieldLabel>
              <Input
                id="sheet-name"
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
            <FieldSeparator />
            <Field>
              <FieldLabel htmlFor="address">Адрес</FieldLabel>
              <Input
                id="address"
                value={formData?.address ?? ""}
                onChange={(e) =>
                  dispatch(
                    employeeDetailsActions.setFormData({
                      data: { ...formData!, address: e.target.value },
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
