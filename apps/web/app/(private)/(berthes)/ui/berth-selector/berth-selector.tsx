"use client"

import React, { memo, useCallback, useEffect, useState } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { Selector } from "@/components/selector/selector"
import { Berth } from "../../model/types/berth.schema"
import {
  getBerthes,
  getBerthesIsLoading,
  getBerthesSearch,
} from "../../model/selectors/berthes.selectors"
import { getBerthesThunk } from "../../model/thunks/get-berthes.thunk"
import { berthesActions, berthesReducer } from "../../model/slice/berthes.slice"
import { BerthEditDialog } from "../berth-edit-dialog/berth-edit-dialog"
import { toast } from "sonner"
import { useAuth } from "@/app/(public)/(auth)"
import { deleteBerthThunk } from "@/Berthes/model/thunks/delete-berth.thunk"

export interface BerthSelectorProps {
  value: Berth | null
  onChange: (value: Berth | null) => void
}

export const BerthSelector = memo((props: BerthSelectorProps) => {
  const { value, onChange } = props

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
  }, [auth?.activeWorkspace?.id, dispatch, onChange, value?.id, value?.name])

  return (
    <DynamicModuleLoader
      reducers={{ berthesSchema: berthesReducer }}
      removeAfterUnmount={true}
    >
      <Selector
        items={data}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selectedValue={value?.id ? value : null}
        onRenderSelectedValue={() => {
          if (value?.id) {
            return <div>{value?.name ?? "No name"}</div>
          }

          return <div>{"Выберите должность"}</div>
        }}
        onChangeSelectedValue={onChange}
        searchValue={search}
        onSearchValueChange={(searchValue: string) => {
          dispatch(berthesActions.setSearch(searchValue))
        }}
        isSearching={isLoading}
        onRenderItem={(item: Berth) => (
          <div className={"flex flex-col items-start justify-start gap-1"}>
            <span>{item.name}</span>
            <span className={"text-xs font-light text-gray-400"}>
              {item.berthType?.name}
            </span>
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
        deleteMessage={`Вы действительно хотите удалить должность \"${value?.name}\"?`}
      />
      {isEdit && (
        <BerthEditDialog
          isOpen={isEdit}
          onOpenChange={(changedOpen) => {
            setIsEdit(changedOpen)
          }}
          berthId={editValueId}
          onSubmit={(data) => {
            onChange(data)
            setIsEdit(false)
          }}
          onClose={() => setIsEdit(false)}
        />
      )}
    </DynamicModuleLoader>
  )
})
