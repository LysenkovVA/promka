// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { berthAdapter } from "../adapter/berth.adapter"
import { GlobalStateSchema } from "@/lib/redux"

const getInitialState = berthAdapter.getInitialState()

export const getBerthes = berthAdapter.getSelectors<GlobalStateSchema>(
  (state) => state.berthesSchema ?? getInitialState
)

export const getBerthesIsLoading = (state: GlobalStateSchema) => {
  return state.berthesSchema?.isLoading ?? false
}

export const getBerthesError = (state: GlobalStateSchema) => {
  return state.berthesSchema?.error ?? ""
}

export const getBerthesIsInitialized = (state: GlobalStateSchema) => {
  return state.berthesSchema?._isInitialized ?? false
}

export const getBerthesTake = (state: GlobalStateSchema) => {
  return state.berthesSchema?.take ?? 10
}

export const getBerthesSkip = (state: GlobalStateSchema) => {
  return state.berthesSchema?.skip ?? 0
}

export const getBerthesSearch = (state: GlobalStateSchema) => {
  return state.berthesSchema?.search ?? ""
}

export const getBerthesTotalCount = (state: GlobalStateSchema) => {
  return state.berthesSchema?.totalCount ?? 0
}

export const getBerthesHasMore = (state: GlobalStateSchema) => {
  return state.berthesSchema?.hasMore ?? true
}

export const getBerthesFilters = (state: GlobalStateSchema) => {
  return state.berthesSchema?.filters ?? undefined
}

export const getBerthesFormDataFilters = (state: GlobalStateSchema) => {
  return state.berthesSchema?.formDataFilters ?? undefined
}
