import { useCallback, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux"
import {
  getEmployeesSimpleList,
  getEmployeesSimpleListError,
  getEmployeesSimpleListIsFetching,
  getEmployeesSimpleListIsInitialized,
} from "../model/selectors/employees-simple-list-selectors"
import { getEmployeesSimpleListThunk } from "../model/thunks/get-employees-simple-list-thunk"
import { getAuthData } from "@/app/(auth)/model/selectors/authSelectors"

export function useEmployeesSimpleList() {
  const dispatch = useAppDispatch()

  const data = useAppSelector(getEmployeesSimpleList.selectAll)
  const isFetching = useAppSelector(getEmployeesSimpleListIsFetching)
  let error = useAppSelector(getEmployeesSimpleListError)
  const isInitialized = useAppSelector(getEmployeesSimpleListIsInitialized)

  const authData = useAppSelector(getAuthData)

  if (!authData?.activeCompany?.workspace?.id) {
    error = "Не удалось определить workspaceId"
  }

  const fetchData = useCallback(
    (replaceData: boolean) => {
      if (authData?.activeCompany?.workspace?.id) {
        dispatch(
          getEmployeesSimpleListThunk({
            replaceData: replaceData,
            workspaceId: authData?.activeCompany.workspace.id,
          })
        )
      }
    },
    [authData?.activeCompany?.workspace?.id, dispatch]
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
