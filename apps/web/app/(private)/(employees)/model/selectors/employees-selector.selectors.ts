// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { employeeAdapter } from "../adapter/employee.adapter"
import { GlobalStateSchema } from "@/lib/redux"

const getInitialState = employeeAdapter.getInitialState()

export const getEmployeesSelector =
  employeeAdapter.getSelectors<GlobalStateSchema>(
    (state) => state.employeesSelectorSchema ?? getInitialState
  )

export const getEmployeesSelectorIsLoading = (state: GlobalStateSchema) => {
  return state.employeesSelectorSchema?.isLoading ?? false
}

export const getEmployeesSelectorError = (state: GlobalStateSchema) => {
  return state.employeesSelectorSchema?.error ?? ""
}

export const getEmployeesSelectorIsInitialized = (state: GlobalStateSchema) => {
  return state.employeesSelectorSchema?._isInitialized ?? false
}

export const getEmployeesSelectorTake = (state: GlobalStateSchema) => {
  return state.employeesSelectorSchema?.take ?? 10
}

export const getEmployeesSelectorSkip = (state: GlobalStateSchema) => {
  return state.employeesSelectorSchema?.skip ?? 0
}

export const getEmployeesSelectorSearch = (state: GlobalStateSchema) => {
  return state.employeesSelectorSchema?.search ?? ""
}

export const getEmployeesSelectorTotalCount = (state: GlobalStateSchema) => {
  return state.employeesSelectorSchema?.totalCount ?? 0
}

export const getEmployeesSelectorHasMore = (state: GlobalStateSchema) => {
  return state.employeesSelectorSchema?.hasMore ?? true
}

export const getEmployeesSelectorFilters = (state: GlobalStateSchema) => {
  return state.employeesSelectorSchema?.filters ?? undefined
}

export const getEmployeesSelectorFormDataFilters = (
  state: GlobalStateSchema
) => {
  return state.employeesSelectorSchema?.formDataFilters ?? undefined
}
