import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

const getCompanyDetails = (state: GlobalStateSchema) => {
  return state.companyDetailsSchema ?? undefined
}

export const getCompanyDetailsData = createSelector(
  getCompanyDetails,
  (schema) => schema?.entityData ?? undefined
)

export const getCompanyDetailsFormData = createSelector(
  getCompanyDetails,
  (schema) => schema?.entityFormData ?? undefined
)

export const getCompanyDetailsIsFetching = createSelector(
  getCompanyDetails,
  (schema) => schema?.isFetching ?? false
)

export const getCompanyDetailsIsSaving = createSelector(
  getCompanyDetails,
  (schema) => schema?.isSaving ?? false
)

export const getCompanyDetailsError = createSelector(
  getCompanyDetails,
  (schema) => schema?.error ?? undefined
)

export const getCompanyDetailsIsInitialized = createSelector(
  getCompanyDetails,
  (schema) => schema?._isInitialized ?? false
)
