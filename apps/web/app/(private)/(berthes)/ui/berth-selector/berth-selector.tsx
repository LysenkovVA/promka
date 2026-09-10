"use client"

import React, { memo, useCallback, useMemo } from "react"
import { Berth } from "../../model/types/berth.schema"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  berthesActions,
  berthesReducer,
} from "@/Berthes/model/slice/berthes.slice"
import {
  getBerthes,
  getBerthesSearch,
} from "@/Berthes/model/selectors/berthes.selectors"
import { getBerthesThunk } from "@/Berthes/model/thunks/get-berthes.thunk"
import { useDebounce } from "@/lib/hooks/useDebounce"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@workspace/ui/components/combobox"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@workspace/ui/components/item"
import { Button } from "@workspace/ui/components/button"
import { IconPlusFilled } from "@tabler/icons-react"

export interface BerthSelectorProps {
  value?: Berth
  onChange?: (berth?: Berth) => void
}

export const BerthSelector = memo((props: BerthSelectorProps) => {
  const { value, onChange } = props

  const dispatch = useAppDispatch()
  const data = useAppSelector(getBerthes.selectAll)
  const search = useAppSelector(getBerthesSearch)

  const comboBoxData = useMemo(() => {
    if (value && !data?.some((item) => item.id === value.id)) {
      return [...(data ?? []), value]
    }
    return data
  }, [data, value])

  const fetchData = useCallback(
    (replaceData: boolean) => {
      dispatch(getBerthesThunk({ replaceData: replaceData }))
    },
    [dispatch]
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      dispatch(berthesActions.setSearch(value))

      if (!value || value.trim() === "") {
        dispatch(berthesActions.clearData())
      } else {
        fetchData(true)
      }
    },
    [dispatch, fetchData]
  )

  const debouncedSearch = useDebounce(handleSearchChange, 1000)

  return (
    <DynamicModuleLoader
      reducers={{ berthesSchema: berthesReducer }}
      removeAfterUnmount={true}
    >
      <Combobox
        items={comboBoxData}
        itemToStringLabel={(item: Berth) => item.name}
        onValueChange={(selectedValue?) => {
          if (!selectedValue) {
            // dispatch(berthesActions.clearData())
            onChange?.(undefined)
          } else {
            onChange?.({ ...selectedValue })
          }
        }}
        defaultValue={null}
        // Нельзя undefined
        value={value ?? null}
      >
        <ComboboxInput
          placeholder={"Найти"}
          onChange={(e) => debouncedSearch(e.target.value)}
        ></ComboboxInput>
        <ComboboxContent>
          {search && (
            <ComboboxEmpty>
              <div
                className={"flex flex-col items-center justify-center gap-2"}
              >
                <div>{"Ничего не найдено"}</div>
                <Button>
                  <IconPlusFilled />
                  <div>{"Добавить"}</div>
                </Button>
              </div>
            </ComboboxEmpty>
          )}
          <ComboboxList>
            {(berth: Berth) => (
              <ComboboxItem key={berth.id} value={berth}>
                {/*Это то что в списке*/}
                <Item size="xs" className="p-0">
                  <ItemContent>
                    <ItemTitle className="whitespace-nowrap">
                      {berth.name}
                    </ItemTitle>
                    <ItemDescription>{"Тип должности"}</ItemDescription>
                  </ItemContent>
                </Item>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </DynamicModuleLoader>
  )
})
