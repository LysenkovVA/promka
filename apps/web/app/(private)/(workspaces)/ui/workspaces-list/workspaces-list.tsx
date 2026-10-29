"use client"

import { memo, useCallback, useEffect } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { workspacesReducer } from "../../model/slice/workspaces.slice"
import {
  getWorkspaces,
  getWorkspacesHasMore,
  getWorkspacesIsInitialized,
  getWorkspacesIsLoading,
  getWorkspacesTotalCount,
} from "../../model/selectors/workspaces.selectors"
import { WorkspaceCard } from "../workspace-card/workspace-card"
import { getWorkspacesThunk } from "../../model/thunks/get-workspaces.thunk"
import { useAuth } from "@/app/(public)/(auth)"
import { useRouter } from "next/navigation"
import { ListWrapper } from "@/components/list-wrapper/list-wrapper"
import { Button } from "@workspace/ui/components/button"
import { IconPlusFilled } from "@tabler/icons-react"
import { changeActiveWorkspaceThunk } from "@/app/(public)/(auth)/model/thunks/changeActiveWorkspaceThunk"

export const WorkspacesList = memo(() => {
  const dispatch = useAppDispatch()

  const data = useAppSelector(getWorkspaces.selectAll)
  const isLoading = useAppSelector(getWorkspacesIsLoading)
  const hasMore = useAppSelector(getWorkspacesHasMore)
  const totalCount = useAppSelector(getWorkspacesTotalCount)
  const isInitialized = useAppSelector(getWorkspacesIsInitialized)

  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isInitialized) {
      dispatch(getWorkspacesThunk({ replaceData: true }))
    }
  }, [dispatch, isInitialized])

  useEffect(() => {
    dispatch(changeActiveWorkspaceThunk({ workspaceId: undefined }))
  }, [])

  const loadNextPart = useCallback(() => {
    if (isInitialized && hasMore && !isLoading) {
      dispatch(getWorkspacesThunk({}))
    }
  }, [dispatch, hasMore, isInitialized, isLoading])

  const header = (
    <div className={"mb-2 h-16 w-full bg-muted"}>
      <div
        className={
          "mr-16 ml-16 flex h-full flex-row items-center justify-between"
        }
      >
        <div className={"text-xl"}>{`Мои организации`}</div>
        <>
          <Button
            onClick={() => {
              router.push(`/workspaces/create`)
            }}
          >
            <IconPlusFilled />
            {"Добавить"}
          </Button>
        </>
      </div>
    </div>
  )

  const footer = (
    <div
      className={"mt-2 flex h-16 w-full items-center justify-start bg-muted"}
    >
      <div className={"justify-start pl-16 text-center text-lg font-bold"}>
        {`Всего: ${totalCount}`}
      </div>
    </div>
  )

  return (
    <DynamicModuleLoader
      reducers={{ workspacesSchema: workspacesReducer }}
      removeAfterUnmount={false}
    >
      <ListWrapper
        onScrollEnd={loadNextPart}
        hasMore={hasMore}
        header={header}
        footer={footer}
        itemsCount={data.length}
      >
        {data && data.length > 0 && (
          <div className={"grid grid-cols-3 gap-3"}>
            {data.map((workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
          </div>
        )}
      </ListWrapper>
    </DynamicModuleLoader>
  )
})
