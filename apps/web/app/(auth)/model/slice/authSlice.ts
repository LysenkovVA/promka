import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { loginThunk } from "../thunks/loginThunk"
import { IAuthData } from "../types/IAuthData"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { refreshThunk } from "@/app/(auth)/model/thunks/refreshThunk"
import { logoutThunk } from "@/app/(auth)/model/thunks/logoutThunk"

const initialState: DetailsReduxSchema<IAuthData> = {
  entityData: {
    user: {
      email: "",
      hashedPassword: "",
    },
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
    setData: (state, action: PayloadAction<IAuthData>) => {
      state.entityData = action.payload
    },
    setFormData: (state, action: PayloadAction<IAuthData>) => {
      state.entityFormData = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.entityData = {
          user: {
            email: "",
            hashedPassword: "",
          },
        }
        state.entityFormData = {
          user: {
            email: "",
            hashedPassword: "",
          },
        }
        state.error = undefined
        state.isFetching = true
        state.isSaving = false
        state._isInitialized = false
      })
      .addCase(loginThunk.fulfilled, (state, payload) => {
        state.entityData = payload.payload
        state.entityFormData = payload.payload
        state.error = undefined
        state.isFetching = false
        state.isSaving = false
        state._isInitialized = true
      })
      .addCase(loginThunk.rejected, (state, error) => {
        state.entityData = {
          user: {
            email: "",
            hashedPassword: "",
          },
        }
        state.entityFormData = {
          user: {
            email: "",
            hashedPassword: "",
          },
        }
        state.error = error.payload
        state.isFetching = false
        state.isSaving = false
        state._isInitialized = true
      })
      .addCase(refreshThunk.fulfilled, (state, action) => {
        const userData = action.payload
        if (userData) {
          state.entityData = userData
          state.entityFormData = userData
          state.error = undefined
          state.isFetching = false
          state.isSaving = false
          state._isInitialized = true
        }
      })
      .addCase(refreshThunk.rejected, (state, error) => {
        state.entityData = {
          user: {
            email: "",
            hashedPassword: "",
          },
        }
        state.entityFormData = {
          user: {
            email: "",
            hashedPassword: "",
          },
        }
        state.error = error.payload
        state.isFetching = false
        state.isSaving = false
        state._isInitialized = true
      })
      .addCase(logoutThunk.fulfilled, (state, error) => {
        state.entityData = {
          user: {
            email: "",
            hashedPassword: "",
          },
        }
        state.entityFormData = {
          user: {
            email: "",
            hashedPassword: "",
          },
        }
        state.error = ""
        state.isFetching = false
        state.isSaving = false
        state._isInitialized = false
      })
  },
})

export const { actions: authActions } = authSlice
export const { reducer: authReducer } = authSlice
