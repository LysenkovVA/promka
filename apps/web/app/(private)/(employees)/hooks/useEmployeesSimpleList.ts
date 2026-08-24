import { useCallback, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux"
import {
  getEmployeesSimpleList,
  getEmployeesSimpleListError,
  getEmployeesSimpleListIsFetching,
  getEmployeesSimpleListIsInitialized,
} from "../model/selectors/employees-simple-list-selectors"
import { getEmployeesSimpleListThunk } from "../model/thunks/get-employees-simple-list-thunk"
import { useAuth } from "@/app/(public)/(auth)"

export function useEmployeesSimpleList() {
  const dispatch = useAppDispatch()

  const data = useAppSelector(getEmployeesSimpleList.selectAll)
  const isFetching = useAppSelector(getEmployeesSimpleListIsFetching)
  let error = useAppSelector(getEmployeesSimpleListError)
  const isInitialized = useAppSelector(getEmployeesSimpleListIsInitialized)

  const { activeWorkspace } = useAuth()

  if (!activeWorkspace?.id) {
    error = "Не удалось определить workspaceId"
  }

  const fetchData = useCallback(
    (replaceData: boolean) => {
      if (activeWorkspace?.id) {
        dispatch(
          getEmployeesSimpleListThunk({
            replaceData: replaceData,
            workspaceId: activeWorkspace.id,
          })
        )
      }
    },
    [activeWorkspace?.id, dispatch]
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
