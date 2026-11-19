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
import { BerthType } from "../../model/types/berth-type.schema"
import {
  getBerthTypes,
  getBerthTypesIsLoading,
  getBerthTypesSearch,
} from "../../model/selectors/berth-types.selectors"
import { getBerthTypesThunk } from "../../model/thunks/get-berth-types.thunk"
import { deleteBerthTypeThunk } from "../../model/thunks/delete-berth-type.thunk"
import {
  berthTypesActions,
  berthTypesReducer,
} from "../../model/slice/berth-types.slice"
import { BerthTypeEditDialog } from "../berth-type-edit-dialog/berth-type-edit-dialog"

export interface BerthTypeSelectorProps {
  value: BerthType | null
  onChange: (value: BerthType | null) => void
  placeholder?: string
  isInvalid?: boolean
}

export const BerthTypeSelector = memo((props: BerthTypeSelectorProps) => {
  const {
    value,
    onChange,
    placeholder = "Выберите тип должности",
    isInvalid = false,
  } = props

  const [isOpen, setIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editValueId, setEditValueId] = useState<string | undefined>(undefined)

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const data = useAppSelector(getBerthTypes.selectAll)
  const search = useAppSelector(getBerthTypesSearch)
  const isLoading = useAppSelector(getBerthTypesIsLoading)

  useEffect(() => {
    if (search) {
      dispatch(getBerthTypesThunk({ replaceData: true }))
    }
  }, [dispatch, search])

  const onDeleteCallback = useCallback(async () => {
    try {
      if (auth?.activeWorkspace?.id && value?.id) {
        const result = await dispatch(
          deleteBerthTypeThunk({
            berthTypeId: value.id,
            workspaceId: auth.activeWorkspace.id,
          })
        ).unwrap()

        if (result.isOk) {
          onChange(null)
          toast.success(`Сотрудник '${value.name}' удалён`, {
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
      reducers={{ berthTypesSchema: berthTypesReducer }}
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
          dispatch(berthTypesActions.setSearch(searchValue))
        }}
        isSearching={isLoading}
        onRenderItem={(item: BerthType) => (
          <div
            className={"flex w-full flex-col items-start justify-center gap-0"}
          >
            <div className={"text-sm"}>{item?.name}</div>
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
        deleteMessage={`Вы действительно хотите удалить тип должности \"${value?.name}\"?`}
      />
      {isEdit && (
        <BerthTypeEditDialog
          isOpen={isEdit}
          onOpenChange={(isOpen) => setIsEdit(isOpen)}
          berthTypeId={editValueId}
          onSubmit={(data) => onChange(data)}
        />
      )}
    </DynamicModuleLoader>
  )
})
