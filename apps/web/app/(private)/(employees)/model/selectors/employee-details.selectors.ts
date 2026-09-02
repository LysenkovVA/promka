import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

const getEmployeeDetails = (state: GlobalStateSchema) => {
  return state.employeeDetailsSchema ?? undefined
}

export const getEmployeeDetailsData = createSelector(
  getEmployeeDetails,
  (schema) => schema?.entityData ?? undefined
)

export const getEmployeeDetailsFormData = createSelector(
  getEmployeeDetails,
  (schema) => schema?.entityFormData ?? undefined
)

export const getEmployeeDetailsIsFetching = createSelector(
  getEmployeeDetails,
  (schema) => schema?.isFetching ?? false
)

export const getEmployeeDetailsIsSaving = createSelector(
  getEmployeeDetails,
  (schema) => schema?.isSaving ?? false
)

export const getEmployeeDetailsError = createSelector(
  getEmployeeDetails,
  (schema) => schema?.error ?? undefined
)

export const getEmployeeDetailsIsInitialized = createSelector(
  getEmployeeDetails,
  (schema) => schema?._isInitialized ?? false
)
