import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

const getSpecializationDirectionDetails = (state: GlobalStateSchema) => {
  return state.specializationDirectionDetailsSchema ?? undefined
}

export const getSpecializationDirectionDetailsData = createSelector(
  getSpecializationDirectionDetails,
  (schema) => schema?.entityData ?? undefined
)

export const getSpecializationDirectionDetailsIsFetching = createSelector(
  getSpecializationDirectionDetails,
  (schema) => schema?.isFetching ?? false
)

export const getSpecializationDirectionDetailsIsSaving = createSelector(
  getSpecializationDirectionDetails,
  (schema) => schema?.isSaving ?? false
)

export const getSpecializationDirectionDetailsError = createSelector(
  getSpecializationDirectionDetails,
  (schema) => schema?.error ?? undefined
)

export const getSpecializationDirectionDetailsIsInitialized = createSelector(
  getSpecializationDirectionDetails,
  (schema) => schema?._isInitialized ?? false
)
