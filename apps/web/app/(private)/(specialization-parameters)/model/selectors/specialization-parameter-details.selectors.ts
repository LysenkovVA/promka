import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

const getSpecializationParameterDetails = (state: GlobalStateSchema) => {
  return state.specializationParameterDetailsSchema ?? undefined
}

export const getSpecializationParameterDetailsData = createSelector(
  getSpecializationParameterDetails,
  (schema) => schema?.entityData ?? undefined
)

export const getSpecializationParameterDetailsIsFetching = createSelector(
  getSpecializationParameterDetails,
  (schema) => schema?.isFetching ?? false
)

export const getSpecializationParameterDetailsIsSaving = createSelector(
  getSpecializationParameterDetails,
  (schema) => schema?.isSaving ?? false
)

export const getSpecializationParameterDetailsError = createSelector(
  getSpecializationParameterDetails,
  (schema) => schema?.error ?? undefined
)

export const getSpecializationParameterDetailsIsInitialized = createSelector(
  getSpecializationParameterDetails,
  (schema) => schema?._isInitialized ?? false
)
