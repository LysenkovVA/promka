"use client"

import React, { memo, useEffect, useState } from "react"
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

export interface BerthSelectorProps {
  value: Berth | null
  onChange: (value: Berth | null) => void
}

export const BerthSelector = memo((props: BerthSelectorProps) => {
  const { value, onChange } = props

  const [isOpen, setIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editValueId, setEditValueId] = useState<string | undefined>(undefined)

  const dispatch = useAppDispatch()
  const data = useAppSelector(getBerthes.selectAll)
  const search = useAppSelector(getBerthesSearch)
  const isLoading = useAppSelector(getBerthesIsLoading)

  useEffect(() => {
    if (search) {
      dispatch(getBerthesThunk({ replaceData: true }))
    }
  }, [dispatch, search])

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
            return <div>{value?.name}</div>
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
        onDeleteClick={() => alert("onDeleteClick")}
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
