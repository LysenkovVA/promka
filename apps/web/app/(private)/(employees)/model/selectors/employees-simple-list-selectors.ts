import { GlobalStateSchema } from "@/lib/redux"
import { employeeAdapter } from "../adapter/employeeAdapter"

// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
const getInitialState = employeeAdapter.getInitialState()

export const getEmployeesSimpleList =
  employeeAdapter.getSelectors<GlobalStateSchema>(
    (state) => state.employeesSimpleListSchema ?? getInitialState
  )

export const getEmployeesSimpleListIsFetching = (state: GlobalStateSchema) => {
  return state.employeesSimpleListSchema?.isFetching ?? false
}

export const getEmployeesSimpleListError = (state: GlobalStateSchema) => {
  return state.employeesSimpleListSchema?.error ?? ""
}

export const getEmployeesSimpleListIsInitialized = (
  state: GlobalStateSchema
) => {
  return state.employeesSimpleListSchema?._isInitialized ?? false
}
