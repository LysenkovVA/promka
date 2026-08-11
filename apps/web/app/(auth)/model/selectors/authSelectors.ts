import { GlobalStateSchema } from "../../../../lib/redux"

export const getAuthData = (state: GlobalStateSchema) => {
  return state.authSchema?.entityData ?? undefined
}

export const getAuthDataUser = (state: GlobalStateSchema) => {
  return state.authSchema?.entityData?.user ?? undefined
}

export const getUserAuthIsLoading = (state: GlobalStateSchema) => {
  return state.authSchema?.isFetching ?? undefined
}

export const getUserAuthDataError = (state: GlobalStateSchema) => {
  return state.authSchema?.error ?? undefined
}

export const getUserAuthDataIsInitialized = (state: GlobalStateSchema) => {
  return state.authSchema?._isInitialized ?? false
}
