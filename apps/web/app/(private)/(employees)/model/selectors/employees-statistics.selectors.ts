import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

const getEmployeeStatistics = (state: GlobalStateSchema) => {
  return state.employeesStatisticsSchema ?? undefined
}

export const getEmployeeStatisticsData = createSelector(
  getEmployeeStatistics,
  (schema) => schema?.entityData ?? undefined
)

export const getEmployeeStatisticsIsFetching = createSelector(
  getEmployeeStatistics,
  (schema) => schema?.isFetching ?? false
)

export const getEmployeeStatisticsIsSaving = createSelector(
  getEmployeeStatistics,
  (schema) => schema?.isSaving ?? false
)

export const getEmployeeStatisticsError = createSelector(
  getEmployeeStatistics,
  (schema) => schema?.error ?? undefined
)

export const getEmployeeStatisticsIsInitialized = createSelector(
  getEmployeeStatistics,
  (schema) => schema?._isInitialized ?? false
)
