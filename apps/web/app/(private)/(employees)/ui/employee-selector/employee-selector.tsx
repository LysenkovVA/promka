"use client"

import React, { memo, useCallback, useEffect, useState } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { Selector } from "@/components/selector/selector"
import { toast } from "sonner"
import { useAuth } from "@/app/(public)/(auth)"
import {
  getEmployeesSelector,
  getEmployeesSelectorIsLoading,
  getEmployeesSelectorSearch,
} from "@/Employees/model/selectors/employees-selector.selectors"
import { getEmployeesSelectorThunk } from "@/Employees/model/thunks/get-employees-selector.thunk"
import { EmployeeHelper } from "@/Employees/helpers/employee-helper"
import {
  employeesSelectorActions,
  employeesSelectorReducer,
} from "@/Employees/model/slice/employees-selector.slice"
import { deleteEmployeeThunk } from "@/Employees/model/thunks/delete-employee.thunk"
import { Employee } from "@/Employees"
import { EmployeeEditDialog } from "@/Employees/ui/employee-edit-dialog/employee-edit-dialog"

export interface EmployeeSelectorProps {
  value: Employee | null
  onChange: (value: Employee | null) => void
}

export const EmployeeSelector = memo((props: EmployeeSelectorProps) => {
  const { value, onChange } = props

  const [isOpen, setIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editValueId, setEditValueId] = useState<string | undefined>(undefined)

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const data = useAppSelector(getEmployeesSelector.selectAll)
  const search = useAppSelector(getEmployeesSelectorSearch)
  const isLoading = useAppSelector(getEmployeesSelectorIsLoading)

  useEffect(() => {
    if (search) {
      dispatch(getEmployeesSelectorThunk({ replaceData: true }))
    }
  }, [dispatch, search])

  const onDeleteCallback = useCallback(async () => {
    try {
      if (auth?.activeWorkspace?.id && value?.id) {
        const result = await dispatch(
          deleteEmployeeThunk({
            employeeId: value.id,
            workspaceId: auth.activeWorkspace.id,
          })
        ).unwrap()

        if (result.isOk) {
          onChange(null)
          toast.success(
            `Сотрудник '${EmployeeHelper.getFullName(value)}' удалён`,
            {
              position: "top-center",
              style: {
                color: "green",
              },
            }
          )
        }
      }
    } catch (error) {
      toast.error((error as string) ?? "Ошибка", {
        position: "top-center",
        style: { color: "tomato" },
      })
    }
  }, [auth?.activeWorkspace?.id, dispatch, onChange, value])

  return (
    <DynamicModuleLoader
      reducers={{ employeesSelectorSchema: employeesSelectorReducer }}
      removeAfterUnmount={true}
    >
      <Selector
        items={data}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selectedValue={value?.id ? value : null}
        onRenderSelectedValue={() => {
          if (value?.id) {
            return <div>{EmployeeHelper.getFullName(value)}</div>
          }

          return <div>{"Выберите сотрудника"}</div>
        }}
        onChangeSelectedValue={onChange}
        searchValue={search}
        onSearchValueChange={(searchValue: string) => {
          dispatch(employeesSelectorActions.setSearch(searchValue))
        }}
        isSearching={isLoading}
        onRenderItem={(item: Employee) => (
          <div
            className={"flex w-full flex-col items-start justify-center gap-0"}
          >
            <div className={"text-sm"}>{EmployeeHelper.getFullName(item)}</div>
          </div>
        )}
        onAddClick={() => {
          toast.message("Add employee click")
          setEditValueId(undefined)
          setIsEdit(true)
        }}
        onEditClick={() => {
          setEditValueId(value?.id ?? undefined)
          setIsEdit(true)
        }}
        onDeleteClick={onDeleteCallback}
        deleteMessage={`Вы действительно хотите удалить сотрудника \"${EmployeeHelper.getFullName(value ?? undefined)}\"?`}
      />
      {isEdit && (
        <EmployeeEditDialog
          isOpen={isEdit}
          onOpenChange={(isOpen) => setIsEdit(isOpen)}
          employeeId={editValueId}
          onSubmit={(data) => onChange(data)}
        />
      )}
    </DynamicModuleLoader>
  )
})
