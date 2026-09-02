// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { employeeAdapter } from "../adapter/employee.adapter"
import { GlobalStateSchema } from "@/lib/redux"

const getInitialState = employeeAdapter.getInitialState()

export const getEmployees = employeeAdapter.getSelectors<GlobalStateSchema>(
  (state) => state.employeesSchema ?? getInitialState
)

export const getEmployeesIsLoading = (state: GlobalStateSchema) => {
  return state.employeesSchema?.isLoading ?? false
}

export const getEmployeesError = (state: GlobalStateSchema) => {
  return state.employeesSchema?.error ?? ""
}

export const getEmployeesIsInitialized = (state: GlobalStateSchema) => {
  return state.employeesSchema?._isInitialized ?? false
}

export const getEmployeesTake = (state: GlobalStateSchema) => {
  return state.employeesSchema?.take ?? 10
}

export const getEmployeesSkip = (state: GlobalStateSchema) => {
  return state.employeesSchema?.skip ?? 0
}

export const getEmployeesSearch = (state: GlobalStateSchema) => {
  return state.employeesSchema?.search ?? ""
}

export const getEmployeesTotalCount = (state: GlobalStateSchema) => {
  return state.employeesSchema?.totalCount ?? 0
}

export const getEmployeesHasMore = (state: GlobalStateSchema) => {
  return state.employeesSchema?.hasMore ?? true
}

export const getEmployeesFilters = (state: GlobalStateSchema) => {
  return state.employeesSchema?.filters ?? undefined
}

export const getEmployeesFormDataFilters = (state: GlobalStateSchema) => {
  return state.employeesSchema?.formDataFilters ?? undefined
}
