import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

const getWorkspaceDetails = (state: GlobalStateSchema) => {
  return state.workspaceDetailsSchema ?? undefined
}

export const getWorkspaceDetailsData = createSelector(
  getWorkspaceDetails,
  (schema) => schema?.entityData ?? undefined
)

export const getWorkspaceDetailsFormData = createSelector(
  getWorkspaceDetails,
  (schema) => schema?.entityFormData ?? undefined
)

export const getWorkspaceDetailsIsFetching = createSelector(
  getWorkspaceDetails,
  (schema) => schema?.isFetching ?? false
)

export const getWorkspaceDetailsIsSaving = createSelector(
  getWorkspaceDetails,
  (schema) => schema?.isSaving ?? false
)

export const getWorkspaceDetailsError = createSelector(
  getWorkspaceDetails,
  (schema) => schema?.error ?? undefined
)

export const getWorkspaceDetailsIsInitialized = createSelector(
  getWorkspaceDetails,
  (schema) => schema?._isInitialized ?? false
)
