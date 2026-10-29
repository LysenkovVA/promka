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
  getCertificatesSearch,
  getCertificatesTotalCount,
} from "@/Certificates/model/selectors/certificates.selectors"
import { getCertificatesThunk } from "@/Certificates/model/thunks/get-certificates.thunk"
import {
  certificatesActions,
  certificatesReducer,
} from "@/Certificates/model/slice/certificates.slice"
import { CertificateCard } from "@/Certificates/ui/certificate-card/certificate-card"
import { useDebounce } from "@/lib/hooks/useDebounce"

export const CertificatesList = memo(() => {
  const dispatch = useAppDispatch()

  const data = useAppSelector(getCertificates.selectAll)
  const isLoading = useAppSelector(getCertificatesIsLoading)
  const hasMore = useAppSelector(getCertificatesHasMore)
  const totalCount = useAppSelector(getCertificatesTotalCount)
  const searchValue = useAppSelector(getCertificatesSearch)
  const isInitialized = useAppSelector(getCertificatesIsInitialized)

  const auth = useAuth()
  const router = useRouter()

  const fetchData = useCallback(() => {
    dispatch(getCertificatesThunk({ replaceData: true }))
  }, [dispatch])

  const debouncedFetchData = useDebounce(fetchData, 800)

  useEffect(() => {
    if (!isInitialized) {
      fetchData()
    }
  }, [fetchData, isInitialized])

  const loadNextPart = useCallback(() => {
    if (isInitialized && hasMore && !isLoading) {
      dispatch(getCertificatesThunk({}))
    }
  }, [dispatch, hasMore, isInitialized, isLoading])

  const onSearchChange = useCallback(
    (searchValue: string) => {
      dispatch(certificatesActions.setSearch(searchValue))
      debouncedFetchData()
    },
    [dispatch, debouncedFetchData]
  )

  return (
    <DynamicModuleLoader
      reducers={{ certificatesSchema: certificatesReducer }}
      removeAfterUnmount={false}
    >
      <ListWrapper
        onScrollEnd={loadNextPart}
        hasMore={hasMore}
        itemsCount={totalCount}
        title={`Удостоверения ${auth?.activeWorkspace?.company?.name}`}
        onAddClick={() =>
          router.push(
            `/workspaces/${auth?.activeWorkspace?.id}/certificates/create`
          )
        }
        searchable
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        isSearching={searchValue.length > 0 && isLoading}
      >
        {data && data.length > 0 && (
          <div className={"grid grid-cols-3 gap-3"}>
            {data.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                hideEmployee={false}
                onClick={() =>
                  router.push(
                    `/workspaces/${auth?.activeWorkspace?.id}/certificates/${certificate.id}`
                  )
                }
              />
            ))}
          </div>
        )}
      </ListWrapper>
    </DynamicModuleLoader>
  )
})
