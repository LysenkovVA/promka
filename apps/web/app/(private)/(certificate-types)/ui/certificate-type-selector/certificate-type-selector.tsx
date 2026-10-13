"use client"

import React, { memo, useCallback, useEffect, useState } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  certificateTypesActions,
  certificateTypesReducer,
} from "../../model/slice/certificate-types.slice"
import { CertificateType } from "../../model/types/certificate-type.schema"
import {
  getCertificateTypes,
  getCertificateTypesIsLoading,
  getCertificateTypesSearch,
} from "../../model/selectors/certificate-types.selectors"
import { getCertificateTypesThunk } from "../../model/thunks/get-certificate-types.thunk"
import { Selector } from "@/components/selector/selector"
import { CertificateTypeEditDialog } from "../certificate-type-edit-dialog/certificate-type-edit-dialog"
import { toast } from "sonner"
import { useAuth } from "@/app/(public)/(auth)"
import { deleteCertificateTypeThunk } from "../../model/thunks/delete-certificate-type.thunk"

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

export interface CertificateTypeSelectorProps {
  value: CertificateType | null
  onChange: (value: CertificateType | null) => void
}

export const CertificateTypeSelector = memo(
  (props: CertificateTypeSelectorProps) => {
    const { value, onChange } = props

    const [isOpen, setIsOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editValueId, setEditValueId] = useState<string | undefined>(
      undefined
    )

    const auth = useAuth()

    const dispatch = useAppDispatch()
    const data = useAppSelector(getCertificateTypes.selectAll)
    const search = useAppSelector(getCertificateTypesSearch)
    const isLoading = useAppSelector(getCertificateTypesIsLoading)

    useEffect(() => {
      if (search) {
        dispatch(getCertificateTypesThunk({ replaceData: true }))
      }
    }, [dispatch, search])

    const onDeleteCallback = useCallback(async () => {
      try {
        if (auth?.activeWorkspace?.id && value?.id) {
          const result = await dispatch(
            deleteCertificateTypeThunk({
              certificateTypeId: value.id,
              workspaceId: auth.activeWorkspace.id,
            })
          ).unwrap()

          if (result.isOk) {
            onChange(null)
            toast.success(`Тип должности '${value.name}' удалён`, {
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
    }, [auth.activeWorkspace.id, dispatch, onChange, value?.id, value?.name])

    return (
      <DynamicModuleLoader
        reducers={{ certificateTypesSchema: certificateTypesReducer }}
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

            return <div>{"Выберите тип"}</div>
          }}
          onChangeSelectedValue={onChange}
          searchValue={search}
          onSearchValueChange={(searchValue: string) => {
            dispatch(certificateTypesActions.setSearch(searchValue))
          }}
          isSearching={isLoading}
          onRenderItem={(item: CertificateType) => (
            <div
              className={
                "flex w-full flex-col items-start justify-center gap-0"
              }
            >
              <div className={"text-sm"}>{item?.name}</div>
              <div className={"text-xs text-muted-foreground"}>
                {`${monthsToText(item.durationAtMonths)}${item.hasGroups ? " | есть группы" : ""}`}
              </div>
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
          <CertificateTypeEditDialog
            isOpen={isEdit}
            onOpenChange={(isOpen) => setIsEdit(isOpen)}
            certificateTypeId={editValueId}
            onSubmit={(data) => onChange(data)}
          />
        )}
      </DynamicModuleLoader>
    )
  }
)
