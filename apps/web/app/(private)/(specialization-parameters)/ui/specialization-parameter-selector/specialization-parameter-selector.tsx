"use client"

import React, { memo, useCallback, useEffect, useState } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  specializationParametersActions,
  specializationParametersReducer,
} from "../../model/slice/specialization-parameters.slice"
import { SpecializationParameter } from "../../model/types/specialization-parameter.schema"
import {
  getSpecializationParameters,
  getSpecializationParametersIsLoading,
  getSpecializationParametersSearch,
} from "../../model/selectors/specialization-parameters.selectors"
import { getSpecializationParametersThunk } from "../../model/thunks/get-specialization-parameters.thunk"
import { Selector } from "@/components/selector/selector"
import { toast } from "sonner"
import { useAuth } from "@/app/(public)/(auth)"
import { deleteSpecializationParameterThunk } from "../../model/thunks/delete-specialization-parameter.thunk"
import { SpecializationParameterEditDialog } from "../specialization-parameter-edit-dialog/specialization-parameter-edit-dialog"

export interface SpecializationParameterSelectorProps {
  value: SpecializationParameter | null
  onChange: (value: SpecializationParameter | null) => void
}

export const SpecializationParameterSelector = memo(
  (props: SpecializationParameterSelectorProps) => {
    const { value, onChange } = props

    const [isOpen, setIsOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editValueId, setEditValueId] = useState<string | undefined>(
      undefined
    )

    const auth = useAuth()

    const dispatch = useAppDispatch()
    const data = useAppSelector(getSpecializationParameters.selectAll)
    const search = useAppSelector(getSpecializationParametersSearch)
    const isLoading = useAppSelector(getSpecializationParametersIsLoading)

    useEffect(() => {
      if (search) {
        dispatch(getSpecializationParametersThunk({ replaceData: true }))
      }
    }, [dispatch, search])

    const onDeleteCallback = useCallback(async () => {
      try {
        if (auth?.activeWorkspace?.id && value?.id) {
          const result = await dispatch(
            deleteSpecializationParameterThunk({
              specializationParameterId: value.id,
              workspaceId: auth.activeWorkspace.id,
            })
          ).unwrap()

          if (result.isOk) {
            onChange(null)
            toast.success(
              `Параметр типа удостоверения '${value.name}' удалён`,
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
          specializationParametersSchema: specializationParametersReducer,
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

            return <div>{"Выберите параметр"}</div>
          }}
          onChangeSelectedValue={onChange}
          searchValue={search}
          onSearchValueChange={(searchValue: string) => {
            dispatch(specializationParametersActions.setSearch(searchValue))
          }}
          isSearching={isLoading}
          onRenderItem={(item: SpecializationParameter) => (
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
          deleteMessage={`Вы действительно хотите удалить тип должности \"${value?.name}\"?`}
        />
        {isEdit && (
          <SpecializationParameterEditDialog
            isOpen={isEdit}
            onOpenChange={(isOpen) => setIsEdit(isOpen)}
            specializationParameterId={editValueId}
            onSubmit={(data) => onChange(data)}
          />
        )}
      </DynamicModuleLoader>
    )
  }
)
