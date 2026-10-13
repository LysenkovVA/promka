// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { GlobalStateSchema } from "@/lib/redux"
import { certificateAdapter } from "../adapter/certificate.adapter"

const getInitialState = certificateAdapter.getInitialState()

export const getCertificates =
  certificateAdapter.getSelectors<GlobalStateSchema>(
    (state) => state.certificatesSchema ?? getInitialState
  )

export const getCertificatesIsLoading = (state: GlobalStateSchema) => {
  return state.certificatesSchema?.isLoading ?? false
}

export const getCertificatesError = (state: GlobalStateSchema) => {
  return state.certificatesSchema?.error ?? ""
}

export const getCertificatesIsInitialized = (state: GlobalStateSchema) => {
  return state.certificatesSchema?._isInitialized ?? false
}

export const getCertificatesTake = (state: GlobalStateSchema) => {
  return state.certificatesSchema?.take ?? 10
}

export const getCertificatesSkip = (state: GlobalStateSchema) => {
  return state.certificatesSchema?.skip ?? 0
}

export const getCertificatesSearch = (state: GlobalStateSchema) => {
  return state.certificatesSchema?.search ?? ""
}

export const getCertificatesTotalCount = (state: GlobalStateSchema) => {
  return state.certificatesSchema?.totalCount ?? 0
}

export const getCertificatesHasMore = (state: GlobalStateSchema) => {
  return state.certificatesSchema?.hasMore ?? true
}

export const getCertificatesFilters = (state: GlobalStateSchema) => {
  return state.certificatesSchema?.filters ?? undefined
}

export const getCertificatesFormDataFilters = (state: GlobalStateSchema) => {
  return state.certificatesSchema?.formDataFilters ?? undefined
}
