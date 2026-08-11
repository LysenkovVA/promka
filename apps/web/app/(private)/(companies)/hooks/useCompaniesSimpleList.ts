import { useCallback, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux"
import {
  getCompaniesSimpleList,
  getCompaniesSimpleListError,
  getCompaniesSimpleListIsFetching,
  getCompaniesSimpleListIsInitialized,
} from "../model/selectors/companies-simple-list-selectors"
import { getCompaniesSimpleListThunk } from "../model/thunks/get-companies-simple-list-thunk"

export function useCompaniesSimpleList() {
  const dispatch = useAppDispatch()

  const data = useAppSelector(getCompaniesSimpleList.selectAll)
  const isFetching = useAppSelector(getCompaniesSimpleListIsFetching)
  const error = useAppSelector(getCompaniesSimpleListError)
  const isInitialized = useAppSelector(getCompaniesSimpleListIsInitialized)

  const fetchData = useCallback(
    (replaceData: boolean) => {
      dispatch(getCompaniesSimpleListThunk({ replaceData: replaceData }))
    },
    [dispatch]
  )

  useEffect(() => {
    if (!isInitialized && !isFetching) {
      fetchData(true)
    }
  }, [fetchData, isInitialized, isFetching])

  return {
    data,
    isFetching,
    error,
  }
}
