"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ICompanyEntity } from "@/app/(private)/(companies)"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { getCompanyByIdThunk } from "@/app/(private)/(companies)/model/thunks/get-company-by-id-thunk"
import { upsertCompanyThunk } from "@/app/(private)/(companies)/model/thunks/upsert-company-thunk"

const initialState: DetailsReduxSchema<ICompanyEntity> = {
  entityData: { name: "" },
  entityFormData: { name: "" },
  error: "",
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const companyDetailsSlice = createSlice({
  name: "companyDetailsSlice",
  initialState,
  reducers: {
    setInitialized: (
      state,
      action: PayloadAction<{ isInitialized: boolean }>
    ) => {
      state._isInitialized = action.payload.isInitialized
    },
    setFormData: (state, action: PayloadAction<{ data: ICompanyEntity }>) => {
      state.entityFormData = action.payload.data
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение по id
      .addCase(getCompanyByIdThunk.pending, (state, action) => {
        state.isFetching = true
        state.isSaving = false
        state.error = ""
        state.entityData = {
          name: "",
        }
        state.entityFormData = {
          name: "",
        }
        state._isInitialized = false
      })
      .addCase(getCompanyByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state.entityFormData = action.payload.data!
        state._isInitialized = true
      })
      .addCase(getCompanyByIdThunk.rejected, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = action.payload
        state.entityData = {
          name: "",
        }
        state.entityFormData = {
          name: "",
        }
        state._isInitialized = true
      })
      .addCase(upsertCompanyThunk.pending, (state, action) => {
        state.isFetching = false
        state.isSaving = true
        state.error = ""
      })
      .addCase(upsertCompanyThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state.entityFormData = action.payload.data!
      })
      .addCase(upsertCompanyThunk.rejected, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = action.payload
      })
  },
})

export const {
  actions: companyDetailsActions,
  reducer: companyDetailsReducer,
} = companyDetailsSlice
