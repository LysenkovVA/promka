// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { protocolAdapter } from "../adapter/protocol.adapter"
import { GlobalStateSchema } from "@/lib/redux"

const getInitialState = protocolAdapter.getInitialState()

export const getProtocolsSelector =
  protocolAdapter.getSelectors<GlobalStateSchema>(
    (state) => state.protocolsSelectorSchema ?? getInitialState
  )

export const getProtocolsSelectorIsLoading = (state: GlobalStateSchema) => {
  return state.protocolsSelectorSchema?.isLoading ?? false
}

export const getProtocolsSelectorError = (state: GlobalStateSchema) => {
  return state.protocolsSelectorSchema?.error ?? ""
}

export const getProtocolsSelectorIsInitialized = (state: GlobalStateSchema) => {
  return state.protocolsSelectorSchema?._isInitialized ?? false
}

export const getProtocolsSelectorTake = (state: GlobalStateSchema) => {
  return state.protocolsSelectorSchema?.take ?? 10
}

export const getProtocolsSelectorSkip = (state: GlobalStateSchema) => {
  return state.protocolsSelectorSchema?.skip ?? 0
}

export const getProtocolsSelectorSearch = (state: GlobalStateSchema) => {
  return state.protocolsSelectorSchema?.search ?? ""
}

export const getProtocolsSelectorTotalCount = (state: GlobalStateSchema) => {
  return state.protocolsSelectorSchema?.totalCount ?? 0
}

export const getProtocolsSelectorHasMore = (state: GlobalStateSchema) => {
  return state.protocolsSelectorSchema?.hasMore ?? true
}

export const getProtocolsSelectorFilters = (state: GlobalStateSchema) => {
  return state.protocolsSelectorSchema?.filters ?? undefined
}

export const getProtocolsSelectorFormDataFilters = (
  state: GlobalStateSchema
) => {
  return state.protocolsSelectorSchema?.formDataFilters ?? undefined
}
