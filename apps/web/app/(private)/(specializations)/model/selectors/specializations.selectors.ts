// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { GlobalStateSchema } from "@/lib/redux"
import { specializationAdapter } from "../adapter/specialization.adapter"

const getInitialState = specializationAdapter.getInitialState()

export const getSpecializations =
  specializationAdapter.getSelectors<GlobalStateSchema>(
    (state) => state.specializationsSchema ?? getInitialState
  )

export const getSpecializationsIsLoading = (state: GlobalStateSchema) => {
  return state.specializationsSchema?.isLoading ?? false
}

export const getSpecializationsError = (state: GlobalStateSchema) => {
  return state.specializationsSchema?.error ?? ""
}

export const getSpecializationsIsInitialized = (state: GlobalStateSchema) => {
  return state.specializationsSchema?._isInitialized ?? false
}

export const getSpecializationsTake = (state: GlobalStateSchema) => {
  return state.specializationsSchema?.take ?? 10
}

export const getSpecializationsSkip = (state: GlobalStateSchema) => {
  return state.specializationsSchema?.skip ?? 0
}

export const getSpecializationsSearch = (state: GlobalStateSchema) => {
  return state.specializationsSchema?.search ?? ""
}

export const getSpecializationsTotalCount = (state: GlobalStateSchema) => {
  return state.specializationsSchema?.totalCount ?? 0
}

export const getSpecializationsHasMore = (state: GlobalStateSchema) => {
  return state.specializationsSchema?.hasMore ?? true
}

export const getSpecializationsFilters = (state: GlobalStateSchema) => {
  return state.specializationsSchema?.filters ?? undefined
}

export const getSpecializationsFormDataFilters = (state: GlobalStateSchema) => {
  return state.specializationsSchema?.formDataFilters ?? undefined
}
