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

export interface BerthSelectorProps {
  value: Berth | null
  onChange: (value: Berth | null) => void
}

export const BerthSelector = memo((props: BerthSelectorProps) => {
  const { value, onChange } = props

  const [isOpen, setIsOpen] = useState(false)

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
        selectedValue={value}
        onRenderSelectedValue={() => {
          if (value) {
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
        onRenderItem={(item: Berth) => <div>{item.name}</div>}
        onAddClick={() => alert("onAddClick")}
        onEditClick={() => alert("onEditClick")}
        onDeleteClick={() => alert("onDeleteClick")}
      />
    </DynamicModuleLoader>
  )
})
