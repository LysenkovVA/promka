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
  getCertificates,
  getCertificatesHasMore,
  getCertificatesIsInitialized,
  getCertificatesIsLoading,
  getCertificatesTotalCount,
} from "@/Certificates/model/selectors/certificates.selectors"
import { getCertificatesThunk } from "@/Certificates/model/thunks/get-certificates.thunk"
import { certificatesReducer } from "@/Certificates/model/slice/certificates.slice"
import { CertificateCard } from "@/Certificates/ui/certificate-card/certificate-card"
import { IconPlusFilled } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"

export const CertificatesList = memo(() => {
  const dispatch = useAppDispatch()

  const data = useAppSelector(getCertificates.selectAll)
  const isLoading = useAppSelector(getCertificatesIsLoading)
  const hasMore = useAppSelector(getCertificatesHasMore)
  const totalCount = useAppSelector(getCertificatesTotalCount)
  const isInitialized = useAppSelector(getCertificatesIsInitialized)

  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isInitialized) {
      dispatch(getCertificatesThunk({ replaceData: true }))
    }
  }, [dispatch, isInitialized])

  const loadNextPart = useCallback(() => {
    if (isInitialized && hasMore && !isLoading) {
      dispatch(getCertificatesThunk({}))
    }
  }, [dispatch, hasMore, isInitialized, isLoading])

  const header = (
    <div className={"mb-2 h-16 w-full bg-muted"}>
      <div
        className={
          "mr-16 ml-16 flex h-full flex-row items-center justify-between"
        }
      >
        <div className={"text-xl"}>{"Удостоверения"}</div>
        <>
          <Button
            onClick={() => {
              router.push(
                `/workspaces/${auth?.activeWorkspace?.id}/certificates/create`
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
      reducers={{ certificatesSchema: certificatesReducer }}
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
            {data.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                hideEmployee={false}
              />
            ))}
          </div>
        )}
      </ListWrapper>
    </DynamicModuleLoader>
  )
})
