"use client"

import React, { memo, useEffect, useState } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  berthTypesActions,
  berthTypesReducer,
} from "@/BerthTypes/model/slice/berth-types.slice"
import { BerthType } from "@/BerthTypes"
import {
  getBerthTypes,
  getBerthTypesIsLoading,
  getBerthTypesSearch,
} from "@/BerthTypes/model/selectors/berth-types.selectors"
import { getBerthTypesThunk } from "@/BerthTypes/model/thunks/get-berth-types.thunk"
import { Selector } from "@/components/selector/selector"

export interface BerthTypeSelectorProps {
  value: BerthType | null
  onChange: (value: BerthType | null) => void
}

export const BerthTypeSelector = memo((props: BerthTypeSelectorProps) => {
  const { value, onChange } = props

  // const [selectedValue, setSelectedValue] = useState<BerthType | null>(value)
  const [isOpen, setIsOpen] = useState(false)

  const dispatch = useAppDispatch()
  const data = useAppSelector(getBerthTypes.selectAll)
  const search = useAppSelector(getBerthTypesSearch)
  const isLoading = useAppSelector(getBerthTypesIsLoading)

  // useEffect(() => {
  //   setSelectedValue(value)
  // }, [value])

  useEffect(() => {
    if (search) {
      dispatch(getBerthTypesThunk({ replaceData: true }))
    }
  }, [dispatch, search])

  return (
    <DynamicModuleLoader
      reducers={{ berthTypesSchema: berthTypesReducer }}
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

          return <div>{"Выберите тип"}</div>
        }}
        onChangeSelectedValue={onChange}
        searchValue={search}
        onSearchValueChange={(searchValue: string) => {
          dispatch(berthTypesActions.setSearch(searchValue))
        }}
        isSearching={isLoading}
        onRenderItem={(item: BerthType) => <div>{item.name}</div>}
        onAddClick={() => alert("onAddClick")}
        onEditClick={() => alert("onEditClick")}
        onDeleteClick={() => alert("onDeleteClick")}
      />
    </DynamicModuleLoader>
  )
})
