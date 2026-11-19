"use client"

import { memo, useCallback, useEffect } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"

import { useAuth } from "@/app/(public)/(auth)"
import { useRouter } from "next/navigation"
import { ListWrapper } from "@/components/list-wrapper/list-wrapper"
import { useDebounce } from "@/lib/hooks/useDebounce"
import { getStudiesThunk } from "../../model/thunks/get-studies.thunk"
import { studiesActions, studiesReducer } from "../../model/slice/studies.slice"
import {
  getStudies,
  getStudiesHasMore,
  getStudiesIsInitialized,
  getStudiesIsLoading,
  getStudiesSearch,
  getStudiesTotalCount,
} from "../../model/selectors/studies.selectors"
import { StudyCardList } from "@/Studies/ui/study-card-list/study-card-list"

export const StudiesList = memo(() => {
  const dispatch = useAppDispatch()

  const data = useAppSelector(getStudies.selectAll)
  const isLoading = useAppSelector(getStudiesIsLoading)
  const hasMore = useAppSelector(getStudiesHasMore)
  const totalCount = useAppSelector(getStudiesTotalCount)
  const isInitialized = useAppSelector(getStudiesIsInitialized)
  const searchValue = useAppSelector(getStudiesSearch)

  const auth = useAuth()
  const router = useRouter()

  const fetchData = useCallback(() => {
    dispatch(getStudiesThunk({ replaceData: true }))
  }, [dispatch])

  const debouncedFetchData = useDebounce(fetchData, 800)

  useEffect(() => {
    if (!isInitialized) {
      fetchData()
    }
  }, [fetchData, isInitialized])

  const loadNextPart = useCallback(() => {
    if (isInitialized && hasMore && !isLoading) {
      dispatch(getStudiesThunk({}))
    }
  }, [dispatch, hasMore, isInitialized, isLoading])

  const onSearchChange = useCallback(
    (searchValue: string) => {
      dispatch(studiesActions.setSearch(searchValue))
      debouncedFetchData()
    },
    [dispatch, debouncedFetchData]
  )

  return (
    <DynamicModuleLoader
      reducers={{ studiesSchema: studiesReducer }}
      removeAfterUnmount={false}
    >
      <ListWrapper
        onScrollEnd={loadNextPart}
        hasMore={hasMore}
        title={`Обучение в ${auth?.activeWorkspace?.company?.name}`}
        itemsCount={totalCount}
        onAddClick={() => {
          router.push(`/workspaces/${auth?.activeWorkspace?.id}/studies/create`)
        }}
        searchable
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        isSearching={searchValue.length > 0 && isLoading}
      >
        <StudyCardList studies={data} />
      </ListWrapper>
    </DynamicModuleLoader>
  )
})
