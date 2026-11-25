import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

const getCitizenshipDetails = (state: GlobalStateSchema) => {
  return state.citizenshipDetailsSchema ?? undefined
}

export const getCitizenshipDetailsData = createSelector(
  getCitizenshipDetails,
  (schema) => schema?.entityData ?? undefined
)

// export const getCitizenshipDetailsFormData = createSelector(
//   getCitizenshipDetails,
//   (schema) => schema?.entityFormData ?? undefined
// )

export const getCitizenshipDetailsIsFetching = createSelector(
  getCitizenshipDetails,
  (schema) => schema?.isFetching ?? false
)

export const getCitizenshipDetailsIsSaving = createSelector(
  getCitizenshipDetails,
  (schema) => schema?.isSaving ?? false
)

export const getCitizenshipDetailsError = createSelector(
  getCitizenshipDetails,
  (schema) => schema?.error ?? undefined
)

export const getCitizenshipDetailsIsInitialized = createSelector(
  getCitizenshipDetails,
  (schema) => schema?._isInitialized ?? false
)
