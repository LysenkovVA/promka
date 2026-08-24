import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { loginThunk } from "../thunks/loginThunk"
import { IAuthData } from "../types/IAuthData"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { refreshThunk } from "@/app/(public)/(auth)/model/thunks/refreshThunk"
import { logoutThunk } from "@/app/(public)/(auth)/model/thunks/logoutThunk"

const initialState: DetailsReduxSchema<IAuthData> = {
  entityData: {
    user: {
      email: "",
      hashedPassword: "",
      emailConfirmed: false,
      phoneNumberConfirmed: false,
    },
    activeWorkspaceId: undefined,
  },
  error: undefined,
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setData: (
      state: DetailsReduxSchema<IAuthData>,
      action: PayloadAction<IAuthData>
    ) => {
      state.entityData = action.payload
    },
    setActiveWorkspaceId: (
      state: DetailsReduxSchema<IAuthData>,
      action: PayloadAction<string | undefined>
    ) => {
      if (state.entityData) {
        state.entityData.activeWorkspaceId = action.payload
      }
    },
    setFormData: (
      state: DetailsReduxSchema<IAuthData>,
      action: PayloadAction<IAuthData>
    ) => {
      state.entityFormData = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state: DetailsReduxSchema<IAuthData>) => {
        state.entityData = {
          user: {
            email: "",
            hashedPassword: "",
            emailConfirmed: false,
            phoneNumberConfirmed: false,
          },
          activeWorkspaceId: undefined,
        }
        state.entityFormData = {
          user: {
            email: "",
            hashedPassword: "",
            emailConfirmed: false,
            phoneNumberConfirmed: false,
          },
          activeWorkspaceId: undefined,
        }
        state.error = undefined
        state.isFetching = true
        state.isSaving = false
        state._isInitialized = false
      })
      .addCase(
        loginThunk.fulfilled,
        (
          state: DetailsReduxSchema<IAuthData>,
          action: PayloadAction<IAuthData>
        ) => {
          state.entityData = action.payload
          state.entityFormData = action.payload
          state.error = undefined
          state.isFetching = false
          state.isSaving = false
          state._isInitialized = true
        }
      )
      .addCase(
        loginThunk.rejected,
        (
          state: DetailsReduxSchema<IAuthData>,
          action: PayloadAction<unknown>
        ) => {
          state.entityData = {
            user: {
              email: "",
              hashedPassword: "",
              emailConfirmed: false,
              phoneNumberConfirmed: false,
            },
          }
          state.entityFormData = {
            user: {
              email: "",
              hashedPassword: "",
              emailConfirmed: false,
              phoneNumberConfirmed: false,
            },
          }
          state.error =
            typeof action.payload === "string" ? action.payload : undefined
          state.isFetching = false
          state.isSaving = false
          state._isInitialized = true
        }
      )
      .addCase(
        refreshThunk.fulfilled,
        (
          state: DetailsReduxSchema<IAuthData>,
          action: PayloadAction<IAuthData | undefined>
        ) => {
          const userData = action.payload
          if (userData) {
            state.entityData = userData
            state.entityFormData = userData
            state.error = undefined
            state.isFetching = false
            state.isSaving = false
            state._isInitialized = true
          }
        }
      )
      .addCase(
        refreshThunk.rejected,
        (
          state: DetailsReduxSchema<IAuthData>,
          action: PayloadAction<unknown>
        ) => {
          state.entityData = {
            user: {
              email: "",
              hashedPassword: "",
              emailConfirmed: false,
              phoneNumberConfirmed: false,
            },
          }
          state.entityFormData = {
            user: {
              email: "",
              hashedPassword: "",
              emailConfirmed: false,
              phoneNumberConfirmed: false,
            },
          }
          state.error =
            typeof action.payload === "string" ? action.payload : undefined
          state.isFetching = false
          state.isSaving = false
          state._isInitialized = true
        }
      )
      .addCase(
        logoutThunk.fulfilled,
        (state: DetailsReduxSchema<IAuthData>) => {
          state.entityData = {
            user: {
              email: "",
              hashedPassword: "",
              emailConfirmed: false,
              phoneNumberConfirmed: false,
            },
          }
          state.entityFormData = {
            user: {
              email: "",
              hashedPassword: "",
              emailConfirmed: false,
              phoneNumberConfirmed: false,
            },
          }
          state.error = ""
          state.isFetching = false
          state.isSaving = false
          state._isInitialized = false
        }
      )
  },
})

export const { actions: authActions } = authSlice
export const { reducer: authReducer } = authSlice
