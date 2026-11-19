"use client"

import React, { memo, useCallback, useEffect, useState } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  specializationDirectionsActions,
  specializationDirectionsReducer,
} from "../../model/slice/specialization-directions.slice"
import { SpecializationDirection } from "../../model/types/specialization-direction.schema"
import {
  getSpecializationDirections,
  getSpecializationDirectionsIsLoading,
  getSpecializationDirectionsSearch,
} from "../../model/selectors/specialization-directions.selectors"
import { getSpecializationDirectionsThunk } from "../../model/thunks/get-specialization-directions.thunk"
import { Selector } from "@/components/selector/selector"
import { toast } from "sonner"
import { useAuth } from "@/app/(public)/(auth)"
import { deleteSpecializationDirectionThunk } from "../../model/thunks/delete-specialization-direction.thunk"
import { SpecializationDirectionEditDialog } from "../specialization-direction-edit-dialog/specialization-direction-edit-dialog"

export interface SpecializationDirectionSelectorProps {
  value: SpecializationDirection | null
  onChange: (value: SpecializationDirection | null) => void
}

export const SpecializationDirectionSelector = memo(
  (props: SpecializationDirectionSelectorProps) => {
    const { value, onChange } = props

    const [isOpen, setIsOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editValueId, setEditValueId] = useState<string | undefined>(
      undefined
    )

    const auth = useAuth()

    const dispatch = useAppDispatch()
    const data = useAppSelector(getSpecializationDirections.selectAll)
    const search = useAppSelector(getSpecializationDirectionsSearch)
    const isLoading = useAppSelector(getSpecializationDirectionsIsLoading)

    useEffect(() => {
      if (search) {
        dispatch(getSpecializationDirectionsThunk({ replaceData: true }))
      }
    }, [dispatch, search])

    const onDeleteCallback = useCallback(async () => {
      try {
        if (auth?.activeWorkspace?.id && value?.id) {
          const result = await dispatch(
            deleteSpecializationDirectionThunk({
              specializationDirectionId: value.id,
              workspaceId: auth.activeWorkspace.id,
            })
          ).unwrap()

          if (result.isOk) {
            onChange(null)
            toast.success(
              `Направление типа удостоверения '${value.name}' удалено`,
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
    }, [auth.activeWorkspace.id, dispatch, onChange, value?.id, value?.name])

    return (
      <DynamicModuleLoader
        reducers={{
          specializationDirectionsSchema: specializationDirectionsReducer,
        }}
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

            return <div>{"Выберите направление"}</div>
          }}
          onChangeSelectedValue={onChange}
          searchValue={search}
          onSearchValueChange={(searchValue: string) => {
            dispatch(specializationDirectionsActions.setSearch(searchValue))
          }}
          isSearching={isLoading}
          onRenderItem={(item: SpecializationDirection) => (
            <div
              className={
                "flex w-full flex-col items-start justify-center gap-0"
              }
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
          deleteMessage={`Вы действительно хотите удалить направление типа удостоверения \"${value?.name}\"?`}
        />
        {isEdit && (
          <SpecializationDirectionEditDialog
            isOpen={isEdit}
            onOpenChange={(isOpen) => setIsEdit(isOpen)}
            specializationDirectionId={editValueId}
            onSubmit={(data) => onChange(data)}
          />
        )}
      </DynamicModuleLoader>
    )
  }
)
