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

  return (
    <DynamicModuleLoader
      reducers={{ workspacesSchema: workspacesReducer }}
      removeAfterUnmount={false}
    >
      <ListWrapper
        onScrollEnd={loadNextPart}
        hasMore={hasMore}
        itemsCount={data.length}
        title={`Мои организации`}
        onAddClick={() => {
          router.push(`/workspaces/create`)
        }}
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
