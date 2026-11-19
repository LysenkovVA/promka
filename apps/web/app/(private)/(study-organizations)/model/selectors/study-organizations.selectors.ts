// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { GlobalStateSchema } from "@/lib/redux"
import { studyOrganizationAdapter } from "../adapter/study-organization.adapter"

const getInitialState = studyOrganizationAdapter.getInitialState()

export const getStudyOrganizations =
  studyOrganizationAdapter.getSelectors<GlobalStateSchema>(
    (state) => state.studyOrganizationsSchema ?? getInitialState
  )

export const getStudyOrganizationsIsLoading = (state: GlobalStateSchema) => {
  return state.studyOrganizationsSchema?.isLoading ?? false
}

export const getStudyOrganizationsError = (state: GlobalStateSchema) => {
  return state.studyOrganizationsSchema?.error ?? ""
}

export const getStudyOrganizationsIsInitialized = (
  state: GlobalStateSchema
) => {
  return state.studyOrganizationsSchema?._isInitialized ?? false
}

export const getStudyOrganizationsTake = (state: GlobalStateSchema) => {
  return state.studyOrganizationsSchema?.take ?? 10
}

export const getStudyOrganizationsSkip = (state: GlobalStateSchema) => {
  return state.studyOrganizationsSchema?.skip ?? 0
}

export const getStudyOrganizationsSearch = (state: GlobalStateSchema) => {
  return state.studyOrganizationsSchema?.search ?? ""
}

export const getStudyOrganizationsTotalCount = (state: GlobalStateSchema) => {
  return state.studyOrganizationsSchema?.totalCount ?? 0
}

export const getStudyOrganizationsHasMore = (state: GlobalStateSchema) => {
  return state.studyOrganizationsSchema?.hasMore ?? true
}

export const getStudyOrganizationsFilters = (state: GlobalStateSchema) => {
  return state.studyOrganizationsSchema?.filters ?? undefined
}

export const getStudyOrganizationsFormDataFilters = (
  state: GlobalStateSchema
) => {
  return state.studyOrganizationsSchema?.formDataFilters ?? undefined
}
