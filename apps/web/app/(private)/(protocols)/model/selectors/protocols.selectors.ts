// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { GlobalStateSchema } from "@/lib/redux"
import { protocolAdapter } from "../adapter/protocol.adapter"

const getInitialState = protocolAdapter.getInitialState()

export const getProtocols = protocolAdapter.getSelectors<GlobalStateSchema>(
  (state) => state.protocolsSchema ?? getInitialState
)

export const getProtocolsIsLoading = (state: GlobalStateSchema) => {
  return state.protocolsSchema?.isLoading ?? false
}

export const getProtocolsError = (state: GlobalStateSchema) => {
  return state.protocolsSchema?.error ?? ""
}

export const getProtocolsIsInitialized = (state: GlobalStateSchema) => {
  return state.protocolsSchema?._isInitialized ?? false
}

export const getProtocolsTake = (state: GlobalStateSchema) => {
  return state.protocolsSchema?.take ?? 10
}

export const getProtocolsSkip = (state: GlobalStateSchema) => {
  return state.protocolsSchema?.skip ?? 0
}

export const getProtocolsSearch = (state: GlobalStateSchema) => {
  return state.protocolsSchema?.search ?? ""
}

export const getProtocolsTotalCount = (state: GlobalStateSchema) => {
  return state.protocolsSchema?.totalCount ?? 0
}

export const getProtocolsHasMore = (state: GlobalStateSchema) => {
  return state.protocolsSchema?.hasMore ?? true
}

export const getProtocolsFilters = (state: GlobalStateSchema) => {
  return state.protocolsSchema?.filters ?? undefined
}

export const getProtocolsFormDataFilters = (state: GlobalStateSchema) => {
  return state.protocolsSchema?.formDataFilters ?? undefined
}
