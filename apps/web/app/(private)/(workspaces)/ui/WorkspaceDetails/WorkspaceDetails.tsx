"use client"

import { memo, useEffect, useState } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { authActions } from "@/app/(public)/(auth)"
import {
  getWorkspaceDetailsData,
  getWorkspaceDetailsError,
  getWorkspaceDetailsIsFetching,
  getWorkspaceDetailsIsInitialized,
} from "@/Workspaces/model/selectors/workspace-details-selectors"
import { getWorkspaceByIdThunk } from "@/Workspaces/model/thunks/get-workspace-by-id-thunk"
import { workspaceDetailsReducer } from "@/Workspaces/model/slice/workspace-details-slice"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Picture } from "@/components/picture"
import { Separator } from "@workspace/ui/components/separator"
import { InfoWidget } from "@/Workspaces/ui/InfoWidget/InfoWidget"
import { EditEmployeeSheet } from "@/app/(private)/(employees)"
import Link from "next/link"

export interface WorkspaceDetailsProps {
  workspaceId: string
}

export const WorkspaceDetails = memo((props: WorkspaceDetailsProps) => {
  const { workspaceId } = props

  const dispatch = useAppDispatch()
  const workspaceData = useAppSelector(getWorkspaceDetailsData)
  const isFetching = useAppSelector(getWorkspaceDetailsIsFetching)
  const error = useAppSelector(getWorkspaceDetailsError)
  const isInitialized = useAppSelector(getWorkspaceDetailsIsInitialized)

  const [employeeSheetIsOpen, setEmployeeSheetIsOpen] = useState(false)

  useEffect(() => {
    if (workspaceId) {
      dispatch(getWorkspaceByIdThunk({ id: workspaceId }))
      dispatch(authActions.setActiveWorkspaceId(workspaceId))
    }
  }, [workspaceId, dispatch])

  return (
    <DynamicModuleLoader
      reducers={{ workspaceDetailsSchema: workspaceDetailsReducer }}
      removeAfterUnmount
    >
      {isFetching && <Skeleton className="h-10 w-[250px]" />}
      {error && <div className={"text-red-400"}>{error}</div>}
      {!isFetching && !error && (
        <div
          className={"flex w-full flex-col items-center justify-center gap-5"}
        >
          {/*Логотип и название компании*/}
          <div className={"flex w-full items-start justify-start gap-3"}>
            <Picture
              src={"/logo.png"}
              alt={"pic"}
              // size={"xs"}
              style={{ width: 200, height: 100, border: "1px solid gray" }}
            />
            <div
              className={
                "flex w-full flex-col items-start justify-center gap-2"
              }
            >
              <div
                style={{ fontSize: 30 }}
              >{`${workspaceData?.company.name}`}</div>
              <Separator />
            </div>
          </div>
          {/*Виджеты*/}
          <div
            className={
              "m-auto flex w-full flex-row items-center justify-center gap-3"
            }
          >
            <Link
              href={`/workspaces/${workspaceId}/employees`}
              className={"w-full cursor-pointer"}
            >
              <InfoWidget
                title={"Сотрудники"}
                count={0}
                onAddClick={() => setEmployeeSheetIsOpen(true)}
              >
                <>
                  <EditEmployeeSheet
                    isOpen={employeeSheetIsOpen}
                    handleOpenChange={(isOpen) =>
                      setEmployeeSheetIsOpen(isOpen)
                    }
                  />
                </>
              </InfoWidget>
            </Link>
          </div>
        </div>
      )}
    </DynamicModuleLoader>
  )
})
