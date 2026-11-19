// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { GlobalStateSchema } from "@/lib/redux"
import { specializationParameterAdapter } from "../adapter/specialization-parameter.adapter"

const getInitialState = specializationParameterAdapter.getInitialState()

export const getSpecializationParameters =
  specializationParameterAdapter.getSelectors<GlobalStateSchema>(
    (state) => state.specializationParametersSchema ?? getInitialState
  )

export const getSpecializationParametersIsLoading = (
  state: GlobalStateSchema
) => {
  return state.specializationParametersSchema?.isLoading ?? false
}

export const getSpecializationParametersError = (state: GlobalStateSchema) => {
  return state.specializationParametersSchema?.error ?? ""
}

export const getSpecializationParametersIsInitialized = (
  state: GlobalStateSchema
) => {
  return state.specializationParametersSchema?._isInitialized ?? false
}

export const getSpecializationParametersTake = (state: GlobalStateSchema) => {
  return state.specializationParametersSchema?.take ?? 10
}

export const getSpecializationParametersSkip = (state: GlobalStateSchema) => {
  return state.specializationParametersSchema?.skip ?? 0
}

export const getSpecializationParametersSearch = (state: GlobalStateSchema) => {
  return state.specializationParametersSchema?.search ?? ""
}

export const getSpecializationParametersTotalCount = (
  state: GlobalStateSchema
) => {
  return state.specializationParametersSchema?.totalCount ?? 0
}

export const getSpecializationParametersHasMore = (
  state: GlobalStateSchema
) => {
  return state.specializationParametersSchema?.hasMore ?? true
}

export const getSpecializationParametersFilters = (
  state: GlobalStateSchema
) => {
  return state.specializationParametersSchema?.filters ?? undefined
}

export const getSpecializationParametersFormDataFilters = (
  state: GlobalStateSchema
) => {
  return state.specializationParametersSchema?.formDataFilters ?? undefined
}
