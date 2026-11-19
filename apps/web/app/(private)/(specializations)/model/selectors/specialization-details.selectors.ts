import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

const getSpecializationDetails = (state: GlobalStateSchema) => {
  return state.specializationDetailsSchema ?? undefined
}

export const getSpecializationDetailsData = createSelector(
  getSpecializationDetails,
  (schema) => schema?.entityData ?? undefined
)

export const getSpecializationDetailsIsFetching = createSelector(
  getSpecializationDetails,
  (schema) => schema?.isFetching ?? false
)

export const getSpecializationDetailsIsSaving = createSelector(
  getSpecializationDetails,
  (schema) => schema?.isSaving ?? false
)

export const getSpecializationDetailsError = createSelector(
  getSpecializationDetails,
  (schema) => schema?.error ?? undefined
)

export const getSpecializationDetailsIsInitialized = createSelector(
  getSpecializationDetails,
  (schema) => schema?._isInitialized ?? false
)
