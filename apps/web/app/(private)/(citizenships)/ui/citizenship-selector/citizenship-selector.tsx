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

import { deleteCitizenshipThunk } from "../../model/thunks/delete-citizenship.thunk"
import { Citizenship } from "../../model/types/citizenship.schema"
import { CitizenshipEditDialog } from "../citizenship-edit-dialog/citizenship-edit-dialog"
import {
  getCitizenships,
  getCitizenshipsIsLoading,
  getCitizenshipsSearch,
} from "../../model/selectors/citizenships.selectors"
import { getCitizenshipsThunk } from "../../model/thunks/get-citizenships.thunk"
import {
  citizenshipsActions,
  citizenshipsReducer,
} from "../../model/slice/citizenships.slice"

export interface CitizenshipSelectorProps {
  value: Citizenship | null
  onChange: (value: Citizenship | null) => void
  placeholder?: string
  isInvalid?: boolean
}

export const CitizenshipSelector = memo((props: CitizenshipSelectorProps) => {
  const {
    value,
    onChange,
    placeholder = "Выберите гражданство",
    isInvalid = false,
  } = props

  const [isOpen, setIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editValueId, setEditValueId] = useState<string | undefined>(undefined)

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const data = useAppSelector(getCitizenships.selectAll)
  const search = useAppSelector(getCitizenshipsSearch)
  const isLoading = useAppSelector(getCitizenshipsIsLoading)

  useEffect(() => {
    if (search) {
      dispatch(getCitizenshipsThunk({ replaceData: true }))
    }
  }, [dispatch, search])

  const onDeleteCallback = useCallback(async () => {
    try {
      if (auth?.activeWorkspace?.id && value?.id) {
        const result = await dispatch(
          deleteCitizenshipThunk({
            citizenshipId: value.id,
            workspaceId: auth.activeWorkspace.id,
          })
        ).unwrap()

        if (result.isOk) {
          onChange(null)
          toast.success(`Гражданство '${value.name}' удалено`, {
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
      reducers={{ citizenshipsSchema: citizenshipsReducer }}
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
          dispatch(citizenshipsActions.setSearch(searchValue))
        }}
        isSearching={isLoading}
        onRenderItem={(item: Citizenship) => (
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
        deleteMessage={`Вы действительно хотите удалить гражданство \"${value?.name}\"?`}
      />
      {isEdit && (
        <CitizenshipEditDialog
          isOpen={isEdit}
          onOpenChange={(isOpen) => setIsEdit(isOpen)}
          citizenshipId={editValueId}
          onSubmit={(data) => onChange(data)}
        />
      )}
    </DynamicModuleLoader>
  )
})
