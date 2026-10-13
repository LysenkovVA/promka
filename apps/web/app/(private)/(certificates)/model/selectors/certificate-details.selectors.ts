import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

const getCertificateDetails = (state: GlobalStateSchema) => {
  return state.certificateDetailsSchema ?? undefined
}

export const getCertificateDetailsData = createSelector(
  getCertificateDetails,
  (schema) => schema?.entityData ?? undefined
)

// export const getCertificateDetailsFormData = createSelector(
//   getCertificateDetails,
//   (schema) => schema?.entityFormData ?? undefined
// )

export const getCertificateDetailsIsFetching = createSelector(
  getCertificateDetails,
  (schema) => schema?.isFetching ?? false
)

export const getCertificateDetailsIsSaving = createSelector(
  getCertificateDetails,
  (schema) => schema?.isSaving ?? false
)

export const getCertificateDetailsError = createSelector(
  getCertificateDetails,
  (schema) => schema?.error ?? undefined
)

export const getCertificateDetailsIsInitialized = createSelector(
  getCertificateDetails,
  (schema) => schema?._isInitialized ?? false
)
