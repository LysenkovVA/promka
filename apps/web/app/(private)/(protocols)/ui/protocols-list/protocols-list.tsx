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
  getProtocolsTotalCount,
} from "@/Protocols/model/selectors/protocols.selectors"
import { getProtocolsThunk } from "@/Protocols/model/thunks/get-protocols.thunk"
import { protocolsReducer } from "@/Protocols/model/slice/protocols.slice"
import { ProtocolCard } from "@/Protocols/ui/protocol-card/protocol-card"
import { IconPlusFilled } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"

export const ProtocolsList = memo(() => {
  const dispatch = useAppDispatch()

  const data = useAppSelector(getProtocols.selectAll)
  const isLoading = useAppSelector(getProtocolsIsLoading)
  const hasMore = useAppSelector(getProtocolsHasMore)
  const totalCount = useAppSelector(getProtocolsTotalCount)
  const isInitialized = useAppSelector(getProtocolsIsInitialized)

  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isInitialized) {
      dispatch(getProtocolsThunk({ replaceData: true }))
    }
  }, [dispatch, isInitialized])

  const loadNextPart = useCallback(() => {
    if (isInitialized && hasMore && !isLoading) {
      dispatch(getProtocolsThunk({}))
    }
  }, [dispatch, hasMore, isInitialized, isLoading])

  const header = (
    <div className={"mb-2 h-16 w-full bg-muted"}>
      <div
        className={
          "mr-16 ml-16 flex h-full flex-row items-center justify-between"
        }
      >
        <div className={"text-xl"}>{"Протоколы"}</div>
        <>
          <Button
            onClick={() => {
              router.push(
                `/workspaces/${auth?.activeWorkspace?.id}/protocols/create`
              )
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
      reducers={{ protocolsSchema: protocolsReducer }}
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
            {data.map((protocol) => (
              <ProtocolCard key={protocol.id} protocol={protocol} />
            ))}
          </div>
        )}
      </ListWrapper>
    </DynamicModuleLoader>
  )
})
