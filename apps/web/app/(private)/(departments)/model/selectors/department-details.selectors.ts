import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

const getDepartmentDetails = (state: GlobalStateSchema) => {
  return state.departmentDetailsSchema ?? undefined
}

export const getDepartmentDetailsData = createSelector(
  getDepartmentDetails,
  (schema) => schema?.entityData ?? undefined
)

// export const getDepartmentDetailsFormData = createSelector(
//   getDepartmentDetails,
//   (schema) => schema?.entityFormData ?? undefined
// )

export const getDepartmentDetailsIsFetching = createSelector(
  getDepartmentDetails,
  (schema) => schema?.isFetching ?? false
)

export const getDepartmentDetailsIsSaving = createSelector(
  getDepartmentDetails,
  (schema) => schema?.isSaving ?? false
)

export const getDepartmentDetailsError = createSelector(
  getDepartmentDetails,
  (schema) => schema?.error ?? undefined
)

export const getDepartmentDetailsIsInitialized = createSelector(
  getDepartmentDetails,
  (schema) => schema?._isInitialized ?? false
)
