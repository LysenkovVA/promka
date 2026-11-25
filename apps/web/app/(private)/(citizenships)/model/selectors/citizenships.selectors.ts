// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { GlobalStateSchema } from "@/lib/redux"
import { citizenshipAdapter } from "../adapter/citizenship.adapter"

const getInitialState = citizenshipAdapter.getInitialState()

export const getCitizenships =
  citizenshipAdapter.getSelectors<GlobalStateSchema>(
    (state) => state.citizenshipsSchema ?? getInitialState
  )

export const getCitizenshipsIsLoading = (state: GlobalStateSchema) => {
  return state.citizenshipsSchema?.isLoading ?? false
}

export const getCitizenshipsError = (state: GlobalStateSchema) => {
  return state.citizenshipsSchema?.error ?? ""
}

export const getCitizenshipsIsInitialized = (state: GlobalStateSchema) => {
  return state.citizenshipsSchema?._isInitialized ?? false
}

export const getCitizenshipsTake = (state: GlobalStateSchema) => {
  return state.citizenshipsSchema?.take ?? 10
}

export const getCitizenshipsSkip = (state: GlobalStateSchema) => {
  return state.citizenshipsSchema?.skip ?? 0
}

export const getCitizenshipsSearch = (state: GlobalStateSchema) => {
  return state.citizenshipsSchema?.search ?? ""
}

export const getCitizenshipsTotalCount = (state: GlobalStateSchema) => {
  return state.citizenshipsSchema?.totalCount ?? 0
}

export const getCitizenshipsHasMore = (state: GlobalStateSchema) => {
  return state.citizenshipsSchema?.hasMore ?? true
}

export const getCitizenshipsFilters = (state: GlobalStateSchema) => {
  return state.citizenshipsSchema?.filters ?? undefined
}

export const getCitizenshipsFormDataFilters = (state: GlobalStateSchema) => {
  return state.citizenshipsSchema?.formDataFilters ?? undefined
}
