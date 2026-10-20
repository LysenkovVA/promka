"use client"

import { memo, useEffect } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
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
import { PageWrapper } from "@/components/page-wrapper/page-wrapper"
import { authActions } from "@/app/(public)/(auth)"
import { Button } from "@workspace/ui/components/button"
import { IconSettings } from "@tabler/icons-react"

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

  // const [employeeSheetIsOpen, setEmployeeSheetIsOpen] = useState(false)

  useEffect(() => {
    if (workspaceId) {
      dispatch(authActions.setActiveWorkspaceId(workspaceId))
      dispatch(getWorkspaceByIdThunk({ id: workspaceId }))
    }
  }, [workspaceId, dispatch])

  return (
    <DynamicModuleLoader
      reducers={{ workspaceDetailsSchema: workspaceDetailsReducer }}
      removeAfterUnmount
    >
      <PageWrapper>
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
                style={{ width: 170, height: 110, border: "1px solid gray" }}
              />
              <div
                className={
                  "flex w-full flex-col items-start justify-center gap-2"
                }
              >
                <div className={"flex w-full items-center justify-between"}>
                  <div
                    className={"text-2xl"}
                  >{`${workspaceData?.company.name}`}</div>
                  <Button
                    variant={"outline"}
                    onClick={() => alert("В разработке")}
                  >
                    <IconSettings />
                  </Button>
                </div>
                <Separator />
                <div className={"rounded-lg border bg-muted p-4"}>
                  {"Здесь будут реквизиты организации"}
                </div>
              </div>
            </div>
            {/*Виджеты*/}
            {/*<div className={"grid w-full grid-cols-3 gap-4"}>*/}
            {/*  <EmployeesWidget />*/}
            {/*</div>*/}
            <div className={"rounded-lg border bg-muted p-4"}>
              {"Здесь будет ещё какая-то полезная информация"}
            </div>
          </div>
        )}
      </PageWrapper>
    </DynamicModuleLoader>
  )
})
