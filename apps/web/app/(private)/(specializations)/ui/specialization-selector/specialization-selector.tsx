"use client"

import React, { memo, useCallback, useEffect, useState } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  specializationsActions,
  specializationsReducer,
} from "../../model/slice/specializations.slice"
import { Specialization } from "../../model/types/specialization.schema"
import {
  getSpecializations,
  getSpecializationsIsLoading,
  getSpecializationsSearch,
} from "../../model/selectors/specializations.selectors"
import { getSpecializationsThunk } from "../../model/thunks/get-specializations.thunk"
import { Selector } from "@/components/selector/selector"
import { SpecializationEditDialog } from "../specialization-edit-dialog/specialization-edit-dialog"
import { toast } from "sonner"
import { useAuth } from "@/app/(public)/(auth)"
import { deleteSpecializationThunk } from "../../model/thunks/delete-specialization.thunk"

function monthsToText(durationAtMonths: number) {
  switch (durationAtMonths) {
    case 0:
      return "Бессрочное"
    case 12:
      return "действует 1 год"
    case 36:
      return "действует 3 года"
    case 60:
      return "действует 5 лет"
    default:
      return `действует ${durationAtMonths} мес.`
  }
}

export interface SpecializationSelectorProps {
  value: Specialization | null
  onChange: (value: Specialization | null) => void
  placeholder?: string
  isInvalid?: boolean
}

export const SpecializationSelector = memo(
  (props: SpecializationSelectorProps) => {
    const {
      value,
      onChange,
      placeholder = "Выберите специализацию",
      isInvalid = false,
    } = props

    const [isOpen, setIsOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editValueId, setEditValueId] = useState<string | undefined>(
      undefined
    )

    const auth = useAuth()

    const dispatch = useAppDispatch()
    const data = useAppSelector(getSpecializations.selectAll)
    const search = useAppSelector(getSpecializationsSearch)
    const isLoading = useAppSelector(getSpecializationsIsLoading)

    useEffect(() => {
      if (search) {
        dispatch(getSpecializationsThunk({ replaceData: true }))
      }
    }, [dispatch, search])

    /**
     * Функция отрисовки элемента списка
     */
    const onRenderItemCallback = useCallback(
      (renderValue?: Specialization | null) => {
        if (!renderValue?.id) return null

        return (
          <div
            className={"flex w-full flex-col items-start justify-center gap-2"}
          >
            <div
              className={
                "flex w-full flex-row items-center justify-start gap-1"
              }
            >
              <div className={"font-bold"}>
                {renderValue?.specializationDirection?.name}
              </div>
              {renderValue.hasParameter ? (
                <div
                  className={"text-xs text-green-400"}
                >{`${renderValue?.specializationParameter?.name} ${renderValue.specializationParameterValue}`}</div>
              ) : null}
            </div>
            <div
              className={"flex w-fit flex-row items-start justify-start gap-2"}
            >
              <div
                className={
                  "rounded-lg border bg-muted p-1 text-xs text-muted-foreground"
                }
              >
                {`${monthsToText(renderValue.durationAtMonths)}`}
              </div>
              {renderValue.validAtOrganizationOnly ? (
                <div
                  className={
                    "rounded-lg border bg-muted p-1 text-xs text-amber-500"
                  }
                >{`только внутри организации`}</div>
              ) : (
                <div
                  className={
                    "rounded-lg border bg-muted p-1 text-xs text-green-500"
                  }
                >{`во всех организациях`}</div>
              )}
            </div>
          </div>
        )
      },
      []
    )

    const onDeleteCallback = useCallback(async () => {
      try {
        if (auth?.activeWorkspace?.id && value?.id) {
          const result = await dispatch(
            deleteSpecializationThunk({
              specializationId: value.id,
              workspaceId: auth.activeWorkspace.id,
            })
          ).unwrap()

          if (result.isOk) {
            onChange(null)
            toast.success(
              `Тип удостоверения '${value.specializationDirection?.name}' удалён`,
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
    }, [
      auth?.activeWorkspace?.id,
      dispatch,
      onChange,
      value?.specializationDirection?.name,
      value?.id,
    ])

    return (
      <DynamicModuleLoader
        reducers={{ specializationsSchema: specializationsReducer }}
        removeAfterUnmount={true}
      >
        <Selector
          className={"min-h-16 w-full"}
          isInvalid={isInvalid}
          items={data}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          selectedValue={value?.id ? value : null}
          onRenderSelectedValue={() => {
            if (value?.id) {
              return onRenderItemCallback(value)
            }

            return <div>{placeholder}</div>
          }}
          onChangeSelectedValue={onChange}
          searchValue={search}
          onSearchValueChange={(searchValue: string) => {
            dispatch(specializationsActions.setSearch(searchValue))
          }}
          isSearching={isLoading}
          onRenderItem={(item: Specialization) => onRenderItemCallback(item)}
          onAddClick={() => {
            setEditValueId(undefined)
            setIsEdit(true)
          }}
          onEditClick={() => {
            setEditValueId(value?.id ?? undefined)
            setIsEdit(true)
          }}
          onDeleteClick={onDeleteCallback}
          deleteMessage={`Вы действительно хотите удалить тип удостоверения \"${value?.specializationDirection?.name}\"?`}
        />
        {isEdit && (
          <SpecializationEditDialog
            isOpen={isEdit}
            onOpenChange={(isOpen) => setIsEdit(isOpen)}
            specializationId={editValueId}
            onSubmit={(data) => onChange(data)}
          />
        )}
      </DynamicModuleLoader>
    )
  }
)
