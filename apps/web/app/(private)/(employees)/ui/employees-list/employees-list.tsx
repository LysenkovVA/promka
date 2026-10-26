"use client"

import { memo, useCallback, useEffect } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { employeesReducer } from "../../model/slice/employees.slice"
import {
  getEmployees,
  getEmployeesHasMore,
  getEmployeesIsInitialized,
  getEmployeesIsLoading,
  getEmployeesTotalCount,
} from "../../model/selectors/employees.selectors"
import { EmployeeCard } from "../employee-card/employee-card"
import { getEmployeesThunk } from "../../model/thunks/get-employees.thunk"
import { useAuth } from "@/app/(public)/(auth)"
import { useRouter } from "next/navigation"
import { ListWrapper } from "@/components/list-wrapper/list-wrapper"
import { Button } from "@workspace/ui/components/button"
import { IconPlusFilled } from "@tabler/icons-react"

export const EmployeesList = memo(() => {
  const dispatch = useAppDispatch()

  const data = useAppSelector(getEmployees.selectAll)
  const isLoading = useAppSelector(getEmployeesIsLoading)
  const hasMore = useAppSelector(getEmployeesHasMore)
  const totalCount = useAppSelector(getEmployeesTotalCount)
  const isInitialized = useAppSelector(getEmployeesIsInitialized)

  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isInitialized) {
      dispatch(getEmployeesThunk({ replaceData: true }))
    }
  }, [dispatch, isInitialized])

  const loadNextPart = useCallback(() => {
    if (isInitialized && hasMore && !isLoading) {
      dispatch(getEmployeesThunk({}))
    }
  }, [dispatch, hasMore, isInitialized, isLoading])

  const header = (
    <div className={"mb-2 h-16 w-full bg-muted"}>
      <div
        className={
          "mr-16 ml-16 flex h-full flex-row items-center justify-between"
        }
      >
        <div className={"text-xl"}>{"Сотрудники"}</div>
        <>
          <Button
            onClick={() => {
              router.push(
                `/workspaces/${auth?.activeWorkspace?.id}/employees/create`
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
      reducers={{ employeesSchema: employeesReducer }}
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
            {data.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>
        )}
      </ListWrapper>
      {/*<PageWrapper>*/}
      {/*  <div className={"flex w-full items-center justify-between pb-4"}>*/}
      {/*    <div className={"text-2xl font-light"}>*/}
      {/*      {`Сотрудники ${auth.activeWorkspace?.company?.name}`}*/}
      {/*    </div>*/}
      {/*    <Button*/}
      {/*      onClick={() =>*/}
      {/*        router.push(*/}
      {/*          `/workspaces/${auth?.activeWorkspace?.id}/employees/create`*/}
      {/*        )*/}
      {/*      }*/}
      {/*    >*/}
      {/*      <IconPlusFilled />*/}
      {/*      {"Добавить"}*/}
      {/*    </Button>*/}
      {/*  </div>*/}
      {/*  {(!data || data?.length === 0) && <div>Список сотрудников пуст</div>}*/}
      {/*  {data && data.length > 0 && (*/}
      {/*    <div className={"grid grid-cols-3 gap-3"}>*/}
      {/*      {data.map((employee) => (*/}
      {/*        <EmployeeCard key={employee.id} employee={employee} />*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*</PageWrapper>*/}
    </DynamicModuleLoader>
  )
})
