// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { GlobalStateSchema } from "@/lib/redux"
import { specializationDirectionAdapter } from "../adapter/specialization-direction.adapter"

const getInitialState = specializationDirectionAdapter.getInitialState()

export const getSpecializationDirections =
  specializationDirectionAdapter.getSelectors<GlobalStateSchema>(
    (state) => state.specializationDirectionsSchema ?? getInitialState
  )

export const getSpecializationDirectionsIsLoading = (
  state: GlobalStateSchema
) => {
  return state.specializationDirectionsSchema?.isLoading ?? false
}

export const getSpecializationDirectionsError = (state: GlobalStateSchema) => {
  return state.specializationDirectionsSchema?.error ?? ""
}

export const getSpecializationDirectionsIsInitialized = (
  state: GlobalStateSchema
) => {
  return state.specializationDirectionsSchema?._isInitialized ?? false
}

export const getSpecializationDirectionsTake = (state: GlobalStateSchema) => {
  return state.specializationDirectionsSchema?.take ?? 10
}

export const getSpecializationDirectionsSkip = (state: GlobalStateSchema) => {
  return state.specializationDirectionsSchema?.skip ?? 0
}

export const getSpecializationDirectionsSearch = (state: GlobalStateSchema) => {
  return state.specializationDirectionsSchema?.search ?? ""
}

export const getSpecializationDirectionsTotalCount = (
  state: GlobalStateSchema
) => {
  return state.specializationDirectionsSchema?.totalCount ?? 0
}

export const getSpecializationDirectionsHasMore = (
  state: GlobalStateSchema
) => {
  return state.specializationDirectionsSchema?.hasMore ?? true
}

export const getSpecializationDirectionsFilters = (
  state: GlobalStateSchema
) => {
  return state.specializationDirectionsSchema?.filters ?? undefined
}

export const getSpecializationDirectionsFormDataFilters = (
  state: GlobalStateSchema
) => {
  return state.specializationDirectionsSchema?.formDataFilters ?? undefined
}
