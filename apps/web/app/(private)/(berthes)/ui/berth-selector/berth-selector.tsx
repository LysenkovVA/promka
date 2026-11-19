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

import { deleteBerthThunk } from "../../model/thunks/delete-berth.thunk"
import { Berth } from "../../model/types/berth.schema"
import { BerthEditDialog } from "../berth-edit-dialog/berth-edit-dialog"
import {
  getBerthes,
  getBerthesIsLoading,
  getBerthesSearch,
} from "../../model/selectors/berthes.selectors"
import { getBerthesThunk } from "../../model/thunks/get-berthes.thunk"
import { berthesActions, berthesReducer } from "../../model/slice/berthes.slice"

export interface BerthSelectorProps {
  value: Berth | null
  onChange: (value: Berth | null) => void
  placeholder?: string
  isInvalid?: boolean
}

export const BerthSelector = memo((props: BerthSelectorProps) => {
  const {
    value,
    onChange,
    placeholder = "Выберите должность",
    isInvalid = false,
  } = props

  const [isOpen, setIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editValueId, setEditValueId] = useState<string | undefined>(undefined)

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const data = useAppSelector(getBerthes.selectAll)
  const search = useAppSelector(getBerthesSearch)
  const isLoading = useAppSelector(getBerthesIsLoading)

  useEffect(() => {
    if (search) {
      dispatch(getBerthesThunk({ replaceData: true }))
    }
  }, [dispatch, search])

  const onDeleteCallback = useCallback(async () => {
    try {
      if (auth?.activeWorkspace?.id && value?.id) {
        const result = await dispatch(
          deleteBerthThunk({
            berthId: value.id,
            workspaceId: auth.activeWorkspace.id,
          })
        ).unwrap()

        if (result.isOk) {
          onChange(null)
          toast.success(`Должность '${value.name}' удалена`, {
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
      reducers={{ berthesSchema: berthesReducer }}
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
          dispatch(berthesActions.setSearch(searchValue))
        }}
        isSearching={isLoading}
        onRenderItem={(item: Berth) => (
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
        deleteMessage={`Вы действительно хотите удалить сотрудника \"${value?.name}\"?`}
      />
      {isEdit && (
        <BerthEditDialog
          isOpen={isEdit}
          onOpenChange={(isOpen) => setIsEdit(isOpen)}
          berthId={editValueId}
          onSubmit={(data) => onChange(data)}
        />
      )}
    </DynamicModuleLoader>
  )
})
