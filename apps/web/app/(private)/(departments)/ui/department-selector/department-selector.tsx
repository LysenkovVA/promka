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

import { deleteDepartmentThunk } from "../../model/thunks/delete-department.thunk"
import { Department } from "../../model/types/department.schema"
import { DepartmentEditDialog } from "../department-edit-dialog/department-edit-dialog"
import {
  getDepartments,
  getDepartmentsIsLoading,
  getDepartmentsSearch,
} from "../../model/selectors/departments.selectors"
import { getDepartmentsThunk } from "../../model/thunks/get-departments.thunk"
import {
  departmentsActions,
  departmentsReducer,
} from "../../model/slice/departments.slice"

export interface DepartmentSelectorProps {
  value: Department | null
  onChange: (value: Department | null) => void
  placeholder?: string
  isInvalid?: boolean
}

export const DepartmentSelector = memo((props: DepartmentSelectorProps) => {
  const {
    value,
    onChange,
    placeholder = "Выберите подразделение",
    isInvalid = false,
  } = props

  const [isOpen, setIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editValueId, setEditValueId] = useState<string | undefined>(undefined)

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const data = useAppSelector(getDepartments.selectAll)
  const search = useAppSelector(getDepartmentsSearch)
  const isLoading = useAppSelector(getDepartmentsIsLoading)

  useEffect(() => {
    if (search) {
      dispatch(getDepartmentsThunk({ replaceData: true }))
    }
  }, [dispatch, search])

  const onDeleteCallback = useCallback(async () => {
    try {
      if (auth?.activeWorkspace?.id && value?.id) {
        const result = await dispatch(
          deleteDepartmentThunk({
            departmentId: value.id,
            workspaceId: auth.activeWorkspace.id,
          })
        ).unwrap()

        if (result.isOk) {
          onChange(null)
          toast.success(`Подразделение '${value.name}' удалена`, {
            position: "top-center",
            style: {
              color: "green",
            },
          })
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
      reducers={{ departmentsSchema: departmentsReducer }}
      removeAfterUnmount={true}
    >
      <Selector
        items={data}
        isInvalid={isInvalid}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selectedValue={value?.id ? value : null}
        onRenderSelectedValue={() => {
          if (value?.id) {
            return <div>{value.name}</div>
          }

          return <div>{placeholder}</div>
        }}
        onChangeSelectedValue={onChange}
        searchValue={search}
        onSearchValueChange={(searchValue: string) => {
          dispatch(departmentsActions.setSearch(searchValue))
        }}
        isSearching={isLoading}
        onRenderItem={(item: Department) => (
          <div
            className={"flex w-full flex-col items-start justify-center gap-0"}
          >
            <div className={"text-sm"}>{item.name}</div>
          </div>
        )}
        onAddClick={() => {
          setEditValueId(undefined)
          setIsEdit(true)
        }}
        onEditClick={() => {
          setEditValueId(value?.id ?? undefined)
          setIsEdit(true)
        }}
        onDeleteClick={onDeleteCallback}
        deleteMessage={`Вы действительно хотите удалить подразделение \"${value?.name}\"?`}
      />
      {isEdit && (
        <DepartmentEditDialog
          isOpen={isEdit}
          onOpenChange={(isOpen) => setIsEdit(isOpen)}
          departmentId={editValueId}
          onSubmit={(data) => onChange(data)}
        />
      )}
    </DynamicModuleLoader>
  )
})
