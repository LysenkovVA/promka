import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

const getCertificateTypeDetails = (state: GlobalStateSchema) => {
  return state.certificateTypeDetailsSchema ?? undefined
}

export const getCertificateTypeDetailsData = createSelector(
  getCertificateTypeDetails,
  (schema) => schema?.entityData ?? undefined
)

// export const getCertificateTypeDetailsFormData = createSelector(
//   getCertificateTypeDetails,
//   (schema) => schema?.entityFormData ?? undefined
// )

export const getCertificateTypeDetailsIsFetching = createSelector(
  getCertificateTypeDetails,
  (schema) => schema?.isFetching ?? false
)

export const getCertificateTypeDetailsIsSaving = createSelector(
  getCertificateTypeDetails,
  (schema) => schema?.isSaving ?? false
)

export const getCertificateTypeDetailsError = createSelector(
  getCertificateTypeDetails,
  (schema) => schema?.error ?? undefined
)

export const getCertificateTypeDetailsIsInitialized = createSelector(
  getCertificateTypeDetails,
  (schema) => schema?._isInitialized ?? false
)
