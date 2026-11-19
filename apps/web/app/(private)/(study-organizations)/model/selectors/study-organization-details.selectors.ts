import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

const getStudyOrganizationDetails = (state: GlobalStateSchema) => {
  return state.studyOrganizationDetailsSchema ?? undefined
}

export const getStudyOrganizationDetailsData = createSelector(
  getStudyOrganizationDetails,
  (schema) => schema?.entityData ?? undefined
)

export const getStudyOrganizationDetailsIsFetching = createSelector(
  getStudyOrganizationDetails,
  (schema) => schema?.isFetching ?? false
)

export const getStudyOrganizationDetailsIsSaving = createSelector(
  getStudyOrganizationDetails,
  (schema) => schema?.isSaving ?? false
)

export const getStudyOrganizationDetailsError = createSelector(
  getStudyOrganizationDetails,
  (schema) => schema?.error ?? undefined
)

export const getStudyOrganizationDetailsIsInitialized = createSelector(
  getStudyOrganizationDetails,
  (schema) => schema?._isInitialized ?? false
)
