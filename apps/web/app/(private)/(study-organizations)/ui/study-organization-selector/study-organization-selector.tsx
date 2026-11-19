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
import { StudyOrganization } from "../../model/types/study-organization.schema"
import {
  getStudyOrganizations,
  getStudyOrganizationsIsLoading,
  getStudyOrganizationsSearch,
} from "../../model/selectors/study-organizations.selectors"
import { getStudyOrganizationsThunk } from "../../model/thunks/get-study-organizations.thunk"
import { deleteStudyOrganizationThunk } from "../../model/thunks/delete-study-organization.thunk"
import {
  studyOrganizationsActions,
  studyOrganizationsReducer,
} from "../../model/slice/study-organizations.slice"
import { StudyOrganizationEditDialog } from "../study-organization-edit-dialog/study-organization-edit-dialog"

export interface StudyOrganizationSelectorProps {
  value: StudyOrganization | null
  onChange: (value: StudyOrganization | null) => void
  placeholder?: string
  isInvalid?: boolean
}

export const StudyOrganizationSelector = memo(
  (props: StudyOrganizationSelectorProps) => {
    const {
      value,
      onChange,
      placeholder = "Выберите учебный центр",
      isInvalid = false,
    } = props

    const [isOpen, setIsOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editValueId, setEditValueId] = useState<string | undefined>(
      undefined
    )

    const auth = useAuth()

    const dispatch = useAppDispatch()
    const data = useAppSelector(getStudyOrganizations.selectAll)
    const search = useAppSelector(getStudyOrganizationsSearch)
    const isLoading = useAppSelector(getStudyOrganizationsIsLoading)

    useEffect(() => {
      if (search) {
        dispatch(getStudyOrganizationsThunk({ replaceData: true }))
      }
    }, [dispatch, search])

    const onDeleteCallback = useCallback(async () => {
      try {
        if (auth?.activeWorkspace?.id && value?.id) {
          const result = await dispatch(
            deleteStudyOrganizationThunk({
              studyOrganizationId: value.id,
              workspaceId: auth.activeWorkspace.id,
            })
          ).unwrap()

          if (result.isOk) {
            onChange(null)
            toast.success(`Учебный центр '${value.name}' удалён`, {
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
        reducers={{
          studyOrganizationsSchema: studyOrganizationsReducer,
        }}
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
              return <div>{value?.name}</div>
            }

            return <div>{placeholder}</div>
          }}
          onChangeSelectedValue={onChange}
          searchValue={search}
          onSearchValueChange={(searchValue: string) => {
            dispatch(studyOrganizationsActions.setSearch(searchValue))
          }}
          isSearching={isLoading}
          onRenderItem={(item: StudyOrganization) => (
            <div
              className={
                "flex w-full flex-col items-start justify-center gap-0"
              }
            >
              <div>{item?.name}</div>
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
          deleteMessage={`Вы действительно хотите удалить учебный центр \"${value?.name}\"?`}
        />
        {isEdit && (
          <StudyOrganizationEditDialog
            isOpen={isEdit}
            onOpenChange={(isOpen) => setIsEdit(isOpen)}
            studyOrganizationId={editValueId}
            onSubmit={(data) => onChange(data)}
          />
        )}
      </DynamicModuleLoader>
    )
  }
)
