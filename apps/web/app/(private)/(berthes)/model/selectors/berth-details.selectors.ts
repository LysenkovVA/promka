import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

const getBerthDetails = (state: GlobalStateSchema) => {
  return state.berthDetailsSchema ?? undefined
}

export const getBerthDetailsData = createSelector(
  getBerthDetails,
  (schema) => schema?.entityData ?? undefined
)

export const getBerthDetailsFormData = createSelector(
  getBerthDetails,
  (schema) => schema?.entityFormData ?? undefined
)

export const getBerthDetailsIsFetching = createSelector(
  getBerthDetails,
  (schema) => schema?.isFetching ?? false
)

export const getBerthDetailsIsSaving = createSelector(
  getBerthDetails,
  (schema) => schema?.isSaving ?? false
)

export const getBerthDetailsError = createSelector(
  getBerthDetails,
  (schema) => schema?.error ?? undefined
)

export const getBerthDetailsIsInitialized = createSelector(
  getBerthDetails,
  (schema) => schema?._isInitialized ?? false
)
