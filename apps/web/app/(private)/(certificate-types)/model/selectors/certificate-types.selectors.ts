// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { GlobalStateSchema } from "@/lib/redux"
import { certificateTypeAdapter } from "../adapter/certificate-type.adapter"

const getInitialState = certificateTypeAdapter.getInitialState()

export const getCertificateTypes =
  certificateTypeAdapter.getSelectors<GlobalStateSchema>(
    (state) => state.certificateTypesSchema ?? getInitialState
  )

export const getCertificateTypesIsLoading = (state: GlobalStateSchema) => {
  return state.certificateTypesSchema?.isLoading ?? false
}

export const getCertificateTypesError = (state: GlobalStateSchema) => {
  return state.certificateTypesSchema?.error ?? ""
}

export const getCertificateTypesIsInitialized = (state: GlobalStateSchema) => {
  return state.certificateTypesSchema?._isInitialized ?? false
}

export const getCertificateTypesTake = (state: GlobalStateSchema) => {
  return state.certificateTypesSchema?.take ?? 10
}

export const getCertificateTypesSkip = (state: GlobalStateSchema) => {
  return state.certificateTypesSchema?.skip ?? 0
}

export const getCertificateTypesSearch = (state: GlobalStateSchema) => {
  return state.certificateTypesSchema?.search ?? ""
}

export const getCertificateTypesTotalCount = (state: GlobalStateSchema) => {
  return state.certificateTypesSchema?.totalCount ?? 0
}

export const getCertificateTypesHasMore = (state: GlobalStateSchema) => {
  return state.certificateTypesSchema?.hasMore ?? true
}

export const getCertificateTypesFilters = (state: GlobalStateSchema) => {
  return state.certificateTypesSchema?.filters ?? undefined
}

export const getCertificateTypesFormDataFilters = (
  state: GlobalStateSchema
) => {
  return state.certificateTypesSchema?.formDataFilters ?? undefined
}
