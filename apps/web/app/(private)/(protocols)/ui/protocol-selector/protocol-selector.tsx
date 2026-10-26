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
import {
  getProtocolsSelector,
  getProtocolsSelectorIsLoading,
  getProtocolsSelectorSearch,
} from "@/Protocols/model/selectors/protocols-selector.selectors"
import { getProtocolsSelectorThunk } from "@/Protocols/model/thunks/get-protocols-selector.thunk"
import {
  protocolsSelectorActions,
  protocolsSelectorReducer,
} from "@/Protocols/model/slice/protocols-selector.slice"
import { deleteProtocolThunk } from "@/Protocols/model/thunks/delete-protocol.thunk"
import { Protocol } from "@/Protocols"
import { ProtocolHelper } from "@/Protocols/model/helpers/protocol-helper"
import { ProtocolEditDialog } from "@/Protocols/ui/protocol-edit-dialog/protocol-edit-dialog"

export interface ProtocolSelectorProps {
  value: Protocol | null
  onChange: (value: Protocol | null) => void
}

export const ProtocolSelector = memo((props: ProtocolSelectorProps) => {
  const { value, onChange } = props

  const [isOpen, setIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editValueId, setEditValueId] = useState<string | undefined>(undefined)

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const data = useAppSelector(getProtocolsSelector.selectAll)
  const search = useAppSelector(getProtocolsSelectorSearch)
  const isLoading = useAppSelector(getProtocolsSelectorIsLoading)

  useEffect(() => {
    if (search) {
      dispatch(getProtocolsSelectorThunk({ replaceData: true }))
    }
  }, [dispatch, search])

  const onDeleteCallback = useCallback(async () => {
    try {
      if (auth?.activeWorkspace?.id && value?.id) {
        const result = await dispatch(
          deleteProtocolThunk({
            protocolId: value.id,
            workspaceId: auth.activeWorkspace.id,
          })
        ).unwrap()

        if (result.isOk) {
          onChange(null)
          toast.success(
            `Протокол '${ProtocolHelper.getNumberAndDate(value)}' удалён`,
            {
              position: "top-center",
              style: {
                color: "green",
              },
            }
          )
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
      reducers={{ protocolsSelectorSchema: protocolsSelectorReducer }}
      removeAfterUnmount={true}
    >
      <Selector
        items={data}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selectedValue={value?.id ? value : null}
        onRenderSelectedValue={() => {
          if (value?.id) {
            return <div>{ProtocolHelper.getNumberAndDate(value)}</div>
          }

          return <div>{"Выберите протокол"}</div>
        }}
        onChangeSelectedValue={onChange}
        searchValue={search}
        onSearchValueChange={(searchValue: string) => {
          dispatch(protocolsSelectorActions.setSearch(searchValue))
        }}
        isSearching={isLoading}
        onRenderItem={(item: Protocol) => (
          <div
            className={"flex w-full flex-col items-start justify-center gap-0"}
          >
            <div className={"text-sm"}>
              {ProtocolHelper.getNumberAndDate(item)}
            </div>
          </div>
        )}
        onAddClick={() => {
          toast.message("Add protocol click")
          setEditValueId(undefined)
          setIsEdit(true)
        }}
        onEditClick={() => {
          setEditValueId(value?.id ?? undefined)
          setIsEdit(true)
        }}
        onDeleteClick={onDeleteCallback}
        deleteMessage={`Вы действительно хотите удалить сотрудника \"${ProtocolHelper.getNumberAndDate(value ?? undefined)}\"?`}
      />
      {isEdit && (
        <ProtocolEditDialog
          isOpen={isEdit}
          onOpenChange={(isOpen) => setIsEdit(isOpen)}
          protocolId={editValueId}
          onSubmit={(data) => onChange(data)}
        />
      )}
    </DynamicModuleLoader>
  )
})
