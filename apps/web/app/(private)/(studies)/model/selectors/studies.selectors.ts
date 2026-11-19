// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { GlobalStateSchema } from "@/lib/redux"
import { studyAdapter } from "../adapter/study.adapter"

const getInitialState = studyAdapter.getInitialState()

export const getStudies = studyAdapter.getSelectors<GlobalStateSchema>(
  (state) => state.studiesSchema ?? getInitialState
)

export const getStudiesIsLoading = (state: GlobalStateSchema) => {
  return state.studiesSchema?.isLoading ?? false
}

export const getStudiesError = (state: GlobalStateSchema) => {
  return state.studiesSchema?.error ?? ""
}

export const getStudiesIsInitialized = (state: GlobalStateSchema) => {
  return state.studiesSchema?._isInitialized ?? false
}

export const getStudiesTake = (state: GlobalStateSchema) => {
  return state.studiesSchema?.take ?? 10
}

export const getStudiesSkip = (state: GlobalStateSchema) => {
  return state.studiesSchema?.skip ?? 0
}

export const getStudiesSearch = (state: GlobalStateSchema) => {
  return state.studiesSchema?.search ?? ""
}

export const getStudiesTotalCount = (state: GlobalStateSchema) => {
  return state.studiesSchema?.totalCount ?? 0
}

export const getStudiesHasMore = (state: GlobalStateSchema) => {
  return state.studiesSchema?.hasMore ?? true
}

export const getStudiesFilters = (state: GlobalStateSchema) => {
  return state.studiesSchema?.filters ?? undefined
}

export const getStudiesFormDataFilters = (state: GlobalStateSchema) => {
  return state.studiesSchema?.formDataFilters ?? undefined
}
