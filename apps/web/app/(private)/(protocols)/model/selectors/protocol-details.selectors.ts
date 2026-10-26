import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

const getProtocolDetails = (state: GlobalStateSchema) => {
  return state.protocolDetailsSchema ?? undefined
}

export const getProtocolDetailsData = createSelector(
  getProtocolDetails,
  (schema) => schema?.entityData ?? undefined
)

// export const getProtocolDetailsFormData = createSelector(
//   getProtocolDetails,
//   (schema) => schema?.entityFormData ?? undefined
// )

export const getProtocolDetailsIsFetching = createSelector(
  getProtocolDetails,
  (schema) => schema?.isFetching ?? false
)

export const getProtocolDetailsIsSaving = createSelector(
  getProtocolDetails,
  (schema) => schema?.isSaving ?? false
)

export const getProtocolDetailsError = createSelector(
  getProtocolDetails,
  (schema) => schema?.error ?? undefined
)

export const getProtocolDetailsIsInitialized = createSelector(
  getProtocolDetails,
  (schema) => schema?._isInitialized ?? false
)
