"use client"

import React, { memo, useEffect, useRef, useState } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { useRouter } from "next/navigation"
import { DetailsWrapper } from "@/components/details-wrapper/details-wrapper"
import { Separator } from "@workspace/ui/components/separator"
import {
  getWorkspaceDetailsData,
  getWorkspaceDetailsError,
  getWorkspaceDetailsIsFetching,
  getWorkspaceDetailsIsInitialized,
} from "@/Workspaces/model/selectors/workspace-details-selectors"
import { getWorkspaceByIdThunk } from "@/Workspaces/model/thunks/get-workspace-by-id-thunk"
import { workspaceDetailsReducer } from "@/Workspaces/model/slice/workspace-details-slice"
import { Picture } from "@/components/picture"
import { TeamMembersList } from "@/TeamMember/ui/team-members-list/team-members-list"
import { WorkspaceDetailsForm } from "@/Workspaces/ui/workspace-details-form/workspace-details-form"
import { changeActiveWorkspaceThunk } from "@/app/(public)/(auth)/model/thunks/changeActiveWorkspaceThunk"

export interface WorkspaceDetailsProps {
  workspaceId: string
}

export const WorkspaceDetails = memo((props: WorkspaceDetailsProps) => {
  const { workspaceId } = props

  const [isEdit, setIsEdit] = useState(false)

  const dispatch = useAppDispatch()
  const data = useAppSelector(getWorkspaceDetailsData)
  const error = useAppSelector(getWorkspaceDetailsError)
  const isInitialized = useAppSelector(getWorkspaceDetailsIsInitialized)
  const isLoading = useAppSelector(getWorkspaceDetailsIsFetching)

  const router = useRouter()

  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (workspaceId && !isInitialized && !isLoading) {
      dispatch(changeActiveWorkspaceThunk({ workspaceId: workspaceId }))
      dispatch(getWorkspaceByIdThunk({ id: workspaceId }))
    }
  }, [dispatch, workspaceId, isInitialized, isLoading])

  // const onDeleteCallback = useCallback(async () => {
  //   try {
  //     if (workspaceId) {
  //       const result = await dispatch(
  //         deleteWorkspaceThunk({
  //           id: workspaceId,
  //         })
  //       ).unwrap()
  //
  //       if (result.isOk) {
  //         toast.success(`Компания '${data?.company.name}' удалена`, {
  //           position: "top-center",
  //           style: {
  //             color: "green",
  //           },
  //         })
  //         router.back()
  //       }
  //     }
  //   } catch (error) {
  //     toast.error((error as string) ?? "Ошибка", {
  //       position: "top-center",
  //       style: { color: "tomato" },
  //     })
  //   }
  // }, [data?.company?.name, dispatch, router, workspaceId])

  return (
    <DynamicModuleLoader
      reducers={{ workspaceDetailsSchema: workspaceDetailsReducer }}
      removeAfterUnmount={true}
    >
      <DetailsWrapper
        error={error}
        isEdit={isEdit}
        onEditClick={() => setIsEdit(true)}
        onSaveClick={() => {
          hiddenSubmitInputRef.current?.click()
        }}
        onBackClick={() => {
          if (isEdit) {
            setIsEdit(false)
          } else {
            router.back()
          }
        }}
        deleteMessage={`Вы действительно хотите удалить "${data?.company?.name}"`}
        // onDeleteClick={onDeleteCallback}
        title={"Организация"}
      >
        {isEdit ? (
          <WorkspaceDetailsForm
            onSubmit={() => {
              setIsEdit(false)
            }}
            submitRef={hiddenSubmitInputRef}
            workspaceId={workspaceId}
          />
        ) : (
          <div
            className={"flex w-full flex-col items-center justify-center gap-5"}
          >
            {/*Логотип и название компании*/}
            <div className={"flex w-full items-start justify-start gap-3"}>
              <Picture
                src={"/logo.png"}
                alt={"pic"}
                style={{ width: 200, height: 130, border: "1px solid gray" }}
              />
              <div
                className={
                  "flex w-full flex-col items-start justify-center gap-2"
                }
              >
                <div className={"text-2xl"}>{`${data?.company.name}`}</div>
                <Separator />
              </div>
            </div>
            <TeamMembersList teamMembers={data?.teamMembers ?? undefined} />
          </div>
        )}
      </DetailsWrapper>
    </DynamicModuleLoader>
  )
})
