import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { loginThunk } from "../thunks/loginThunk"
import { IAuthData } from "../types/IAuthData"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { refreshThunk } from "@/app/(auth)/model/thunks/refreshThunk"
import { logoutThunk } from "@/app/(auth)/model/thunks/logoutThunk"
import { upsertUserThunk } from "@/app/(private)/(users)/model/thunks/upsertUserThunk"
import { IUserEntity } from "@/app/(private)/(users)"
import { ResponseData } from "@/lib/responses/ResponseData"

const initialState: DetailsReduxSchema<IAuthData> = {
  entityData: {
    user: {
      email: "",
      hashedPassword: "",
      emailConfirmed: false,
      phoneNumberConfirmed: false,
    },
    activeCompany: undefined,
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
          activeCompany: undefined,
        }
        state.entityFormData = {
          user: {
            email: "",
            hashedPassword: "",
            emailConfirmed: false,
            phoneNumberConfirmed: false,
          },
          activeCompany: undefined,
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
      .addCase(
        upsertUserThunk.fulfilled,
        (
          state: DetailsReduxSchema<IAuthData>,
          payload: PayloadAction<ResponseData<IUserEntity | undefined>>
        ) => {
          state.entityData = { user: payload.payload!.data! }
          state.entityFormData = { user: payload.payload!.data! }
        }
      )
  },
})

export const { actions: authActions } = authSlice
export const { reducer: authReducer } = authSlice
