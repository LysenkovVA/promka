"use client"

import { memo, useCallback, useEffect } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  employeesActions,
  employeesReducer,
} from "../../model/slice/employees.slice"
import {
  getEmployees,
  getEmployeesHasMore,
  getEmployeesIsInitialized,
  getEmployeesIsLoading,
  getEmployeesSearch,
  getEmployeesTotalCount,
} from "../../model/selectors/employees.selectors"
import { EmployeeCard } from "../employee-card/employee-card"
import { getEmployeesThunk } from "../../model/thunks/get-employees.thunk"
import { useAuth } from "@/app/(public)/(auth)"
import { useRouter } from "next/navigation"
import { ListWrapper } from "@/components/list-wrapper/list-wrapper"
import { useDebounce } from "@/lib/hooks/useDebounce"

export const EmployeesList = memo(() => {
  const dispatch = useAppDispatch()

  const data = useAppSelector(getEmployees.selectAll)
  const isLoading = useAppSelector(getEmployeesIsLoading)
  const hasMore = useAppSelector(getEmployeesHasMore)
  const totalCount = useAppSelector(getEmployeesTotalCount)
  const isInitialized = useAppSelector(getEmployeesIsInitialized)
  const searchValue = useAppSelector(getEmployeesSearch)

  const auth = useAuth()
  const router = useRouter()

  const fetchData = useCallback(() => {
    dispatch(getEmployeesThunk({ replaceData: true }))
  }, [dispatch])

  const debouncedFetchData = useDebounce(fetchData, 800)

  useEffect(() => {
    if (!isInitialized) {
      fetchData()
    }
  }, [fetchData, isInitialized])

  const loadNextPart = useCallback(() => {
    if (isInitialized && hasMore && !isLoading) {
      dispatch(getEmployeesThunk({}))
    }
  }, [dispatch, hasMore, isInitialized, isLoading])

  const onSearchChange = useCallback(
    (searchValue: string) => {
      dispatch(employeesActions.setSearch(searchValue))
      debouncedFetchData()
    },
    [dispatch, debouncedFetchData]
  )

  return (
    <DynamicModuleLoader
      reducers={{ employeesSchema: employeesReducer }}
      removeAfterUnmount={false}
    >
      <ListWrapper
        onScrollEnd={loadNextPart}
        hasMore={hasMore}
        title={`Сотрудники ${auth?.activeWorkspace?.company?.name}`}
        itemsCount={totalCount}
        onAddClick={() => {
          router.push(
            `/workspaces/${auth?.activeWorkspace?.id}/employees/create`
          )
        }}
        searchable
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        isSearching={searchValue.length > 0 && isLoading}
      >
        {data && data.length > 0 && (
          <div className={"grid grid-cols-3 gap-3"}>
            {data.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>
        )}
      </ListWrapper>
    </DynamicModuleLoader>
  )
})
