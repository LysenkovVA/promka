import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

const getBerthTypeDetails = (state: GlobalStateSchema) => {
  return state.berthTypeDetailsSchema ?? undefined
}

export const getBerthTypeDetailsData = createSelector(
  getBerthTypeDetails,
  (schema) => schema?.entityData ?? undefined
)

// export const getBerthTypeDetailsFormData = createSelector(
//   getBerthTypeDetails,
//   (schema) => schema?.entityFormData ?? undefined
// )

export const getBerthTypeDetailsIsFetching = createSelector(
  getBerthTypeDetails,
  (schema) => schema?.isFetching ?? false
)

export const getBerthTypeDetailsIsSaving = createSelector(
  getBerthTypeDetails,
  (schema) => schema?.isSaving ?? false
)

export const getBerthTypeDetailsError = createSelector(
  getBerthTypeDetails,
  (schema) => schema?.error ?? undefined
)

export const getBerthTypeDetailsIsInitialized = createSelector(
  getBerthTypeDetails,
  (schema) => schema?._isInitialized ?? false
)
