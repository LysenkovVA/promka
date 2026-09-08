"use client"

import { memo, useCallback, useEffect, useState } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  berthesActions,
  berthesReducer,
} from "@/Berthes/model/slice/berthes.slice"
import { Berth } from "../../model/types/berth.schema"
import { getBerthesThunk } from "@/Berthes/model/thunks/get-berthes.thunk"
import {
  getBerthes,
  getBerthesIsInitialized,
  getBerthesSearch,
} from "@/Berthes/model/selectors/berthes.selectors"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Input } from "@workspace/ui/components/input"
import { Field } from "@workspace/ui/components/field"
import { useDebounce } from "@/lib/hooks/useDebounce"

export interface BerthSelectProps {
  value?: Berth
  onChange?: (value: Berth) => void
  onClear?: () => void
}

export const BerthSelect = memo((props: BerthSelectProps) => {
  const { value, onChange, onClear } = props

  const [selectedValue, setSelectedValue] = useState<Berth | undefined>(
    undefined
  )

  useEffect(() => {
    setSelectedValue(value)
  }, [value])

  const dispatch = useAppDispatch()
  const data = useAppSelector(getBerthes.selectAll)
  const isInitialized = useAppSelector(getBerthesIsInitialized)
  const search = useAppSelector(getBerthesSearch)

  const fetchData = useCallback(
    (replaceData: boolean) => {
      // if (replaceData) {
      //   dispatch(initDocumentsListThunk({}));
      // }

      dispatch(getBerthesThunk({ replaceData: replaceData }))
    },
    [dispatch]
  )

  useEffect(() => {
    if (!isInitialized) fetchData(true)
  }, [])

  const debouncedFetchData = useDebounce(fetchData, 1000)

  const setSearchCallback = useCallback(
    (search: string) => {
      dispatch(berthesActions.setSearch(search))
      debouncedFetchData(true)
    },
    [dispatch, debouncedFetchData]
  )

  return (
    <DynamicModuleLoader reducers={{ berthesSchema: berthesReducer }}>
      <Select
        value={selectedValue?.id ?? undefined}
        onValueChange={(id) => {
          const berth = data?.find((item) => item.id === id)
          if (berth) {
            onChange?.(berth)
          }
        }}
      >
        <SelectTrigger className="flex items-center justify-between gap-2">
          <SelectValue>{selectedValue?.name ?? "Выберите..."}</SelectValue>
        </SelectTrigger>
        <SelectContent position={"popper"}>
          <SelectGroup>
            <Field>
              <Input
                id="search"
                placeholder="Найти..."
                value={search}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation()
                  setSearchCallback(e.target.value)
                }}
              />
            </Field>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            {selectedValue &&
              !data?.some((item) => item.id === selectedValue.id) &&
              !search && (
                <SelectItem key={selectedValue.id} value={selectedValue.id!}>
                  {selectedValue.name}
                </SelectItem>
              )}
            {data?.map((item) => (
              <SelectItem key={item.id} value={item.id!}>
                {item.name}
              </SelectItem>
            ))}
            {data?.length === 0 && (
              <SelectItem value="no-results" disabled>
                Ничего не найдено
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </DynamicModuleLoader>
  )
})
