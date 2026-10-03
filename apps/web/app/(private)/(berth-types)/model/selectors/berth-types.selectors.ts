// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { GlobalStateSchema } from "@/lib/redux"
import { berthTypeAdapter } from "../adapter/berth-type.adapter"

const getInitialState = berthTypeAdapter.getInitialState()

export const getBerthTypes = berthTypeAdapter.getSelectors<GlobalStateSchema>(
  (state) => state.berthTypesSchema ?? getInitialState
)

export const getBerthTypesIsLoading = (state: GlobalStateSchema) => {
  return state.berthTypesSchema?.isLoading ?? false
}

export const getBerthTypesError = (state: GlobalStateSchema) => {
  return state.berthTypesSchema?.error ?? ""
}

export const getBerthTypesIsInitialized = (state: GlobalStateSchema) => {
  return state.berthTypesSchema?._isInitialized ?? false
}

export const getBerthTypesTake = (state: GlobalStateSchema) => {
  return state.berthTypesSchema?.take ?? 10
}

export const getBerthTypesSkip = (state: GlobalStateSchema) => {
  return state.berthTypesSchema?.skip ?? 0
}

export const getBerthTypesSearch = (state: GlobalStateSchema) => {
  return state.berthTypesSchema?.search ?? ""
}

export const getBerthTypesTotalCount = (state: GlobalStateSchema) => {
  return state.berthTypesSchema?.totalCount ?? 0
}

export const getBerthTypesHasMore = (state: GlobalStateSchema) => {
  return state.berthTypesSchema?.hasMore ?? true
}

export const getBerthTypesFilters = (state: GlobalStateSchema) => {
  return state.berthTypesSchema?.filters ?? undefined
}

export const getBerthTypesFormDataFilters = (state: GlobalStateSchema) => {
  return state.berthTypesSchema?.formDataFilters ?? undefined
}
