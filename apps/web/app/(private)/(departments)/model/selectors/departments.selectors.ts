// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { GlobalStateSchema } from "@/lib/redux"
import { departmentAdapter } from "../adapter/department.adapter"

const getInitialState = departmentAdapter.getInitialState()

export const getDepartments = departmentAdapter.getSelectors<GlobalStateSchema>(
  (state) => state.departmentsSchema ?? getInitialState
)

export const getDepartmentsIsLoading = (state: GlobalStateSchema) => {
  return state.departmentsSchema?.isLoading ?? false
}

export const getDepartmentsError = (state: GlobalStateSchema) => {
  return state.departmentsSchema?.error ?? ""
}

export const getDepartmentsIsInitialized = (state: GlobalStateSchema) => {
  return state.departmentsSchema?._isInitialized ?? false
}

export const getDepartmentsTake = (state: GlobalStateSchema) => {
  return state.departmentsSchema?.take ?? 10
}

export const getDepartmentsSkip = (state: GlobalStateSchema) => {
  return state.departmentsSchema?.skip ?? 0
}

export const getDepartmentsSearch = (state: GlobalStateSchema) => {
  return state.departmentsSchema?.search ?? ""
}

export const getDepartmentsTotalCount = (state: GlobalStateSchema) => {
  return state.departmentsSchema?.totalCount ?? 0
}

export const getDepartmentsHasMore = (state: GlobalStateSchema) => {
  return state.departmentsSchema?.hasMore ?? true
}

export const getDepartmentsFilters = (state: GlobalStateSchema) => {
  return state.departmentsSchema?.filters ?? undefined
}

export const getDepartmentsFormDataFilters = (state: GlobalStateSchema) => {
  return state.departmentsSchema?.formDataFilters ?? undefined
}
