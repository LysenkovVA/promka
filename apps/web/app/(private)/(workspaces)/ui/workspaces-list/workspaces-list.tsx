"use client"

import { memo, useCallback, useEffect } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  workspacesActions,
  workspacesReducer,
} from "../../model/slice/workspaces.slice"
import {
  getWorkspaces,
  getWorkspacesHasMore,
  getWorkspacesIsInitialized,
  getWorkspacesIsLoading,
  getWorkspacesSearch,
  getWorkspacesTotalCount,
} from "../../model/selectors/workspaces.selectors"
import { WorkspaceCard } from "../workspace-card/workspace-card"
import { getWorkspacesThunk } from "../../model/thunks/get-workspaces.thunk"
import { useRouter } from "next/navigation"
import { ListWrapper } from "@/components/list-wrapper/list-wrapper"
import { changeActiveWorkspaceThunk } from "@/app/(public)/(auth)"
import { useDebounce } from "@/lib/hooks/useDebounce"

export const WorkspacesList = memo(() => {
  const dispatch = useAppDispatch()

  const data = useAppSelector(getWorkspaces.selectAll)
  const isLoading = useAppSelector(getWorkspacesIsLoading)
  const hasMore = useAppSelector(getWorkspacesHasMore)
  const totalCount = useAppSelector(getWorkspacesTotalCount)
  const searchValue = useAppSelector(getWorkspacesSearch)
  const isInitialized = useAppSelector(getWorkspacesIsInitialized)

  const router = useRouter()

  useEffect(() => {
    dispatch(changeActiveWorkspaceThunk({ workspaceId: undefined }))
  }, [])

  const fetchData = useCallback(() => {
    dispatch(getWorkspacesThunk({ replaceData: true }))
  }, [dispatch])

  const debouncedFetchData = useDebounce(fetchData, 800)

  useEffect(() => {
    if (!isInitialized) {
      fetchData()
    }
  }, [fetchData, isInitialized])

  const loadNextPart = useCallback(() => {
    if (isInitialized && hasMore && !isLoading) {
      dispatch(getWorkspacesThunk({}))
    }
  }, [dispatch, hasMore, isInitialized, isLoading])

  const onSearchChange = useCallback(
    (searchValue: string) => {
      dispatch(workspacesActions.setSearch(searchValue))
      debouncedFetchData()
    },
    [dispatch, debouncedFetchData]
  )

  return (
    <DynamicModuleLoader
      reducers={{ workspacesSchema: workspacesReducer }}
      removeAfterUnmount={false}
    >
      <ListWrapper
        onScrollEnd={loadNextPart}
        hasMore={hasMore}
        itemsCount={totalCount}
        title={`Мои организации`}
        onAddClick={() => {
          router.push(`/workspaces/create`)
        }}
        searchable
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        isSearching={searchValue.length > 0 && isLoading}
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
