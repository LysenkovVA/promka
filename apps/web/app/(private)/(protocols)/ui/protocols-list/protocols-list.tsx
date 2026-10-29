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
import {
  getProtocols,
  getProtocolsHasMore,
  getProtocolsIsInitialized,
  getProtocolsIsLoading,
  getProtocolsSearch,
  getProtocolsTotalCount,
} from "@/Protocols/model/selectors/protocols.selectors"
import { getProtocolsThunk } from "@/Protocols/model/thunks/get-protocols.thunk"
import {
  protocolsActions,
  protocolsReducer,
} from "@/Protocols/model/slice/protocols.slice"
import { ProtocolCard } from "@/Protocols/ui/protocol-card/protocol-card"
import { useDebounce } from "@/lib/hooks/useDebounce"

export const ProtocolsList = memo(() => {
  const dispatch = useAppDispatch()

  const data = useAppSelector(getProtocols.selectAll)
  const isLoading = useAppSelector(getProtocolsIsLoading)
  const hasMore = useAppSelector(getProtocolsHasMore)
  const totalCount = useAppSelector(getProtocolsTotalCount)
  const searchValue = useAppSelector(getProtocolsSearch)
  const isInitialized = useAppSelector(getProtocolsIsInitialized)

  const auth = useAuth()
  const router = useRouter()

  const fetchData = useCallback(() => {
    dispatch(getProtocolsThunk({ replaceData: true }))
  }, [dispatch])

  const debouncedFetchData = useDebounce(fetchData, 800)

  useEffect(() => {
    if (!isInitialized) {
      fetchData()
    }
  }, [fetchData, isInitialized])

  const loadNextPart = useCallback(() => {
    if (isInitialized && hasMore && !isLoading) {
      dispatch(getProtocolsThunk({}))
    }
  }, [dispatch, hasMore, isInitialized, isLoading])

  const onSearchChange = useCallback(
    (searchValue: string) => {
      dispatch(protocolsActions.setSearch(searchValue))
      debouncedFetchData()
    },
    [dispatch, debouncedFetchData]
  )

  return (
    <DynamicModuleLoader
      reducers={{ protocolsSchema: protocolsReducer }}
      removeAfterUnmount={false}
    >
      <ListWrapper
        onScrollEnd={loadNextPart}
        hasMore={hasMore}
        itemsCount={data.length}
        title={`Протоколы ${auth?.activeWorkspace?.company?.name}`}
        onAddClick={() => {
          router.push(
            `/workspaces/${auth?.activeWorkspace?.id}/protocols/create`
          )
        }}
        searchable
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        isSearching={searchValue.length > 0 && isLoading}
      >
        {data && data.length > 0 && (
          <div className={"grid grid-cols-3 gap-3"}>
            {data.map((protocol) => (
              <ProtocolCard key={protocol.id} protocol={protocol} />
            ))}
          </div>
        )}
      </ListWrapper>
    </DynamicModuleLoader>
  )
})
