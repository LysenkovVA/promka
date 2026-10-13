"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { CertificateType } from "../types/certificate-type.schema"
import { getCertificateTypeByIdThunk } from "../thunks/get-certificate-type-by-id.thunk"
import { updateCertificateTypeThunk } from "../thunks/update-certificate-type.thunk"

const initialState: DetailsReduxSchema<CertificateType> = {
  entityData: { name: "", hasGroups: false, durationAtMonths: 0 },
  error: "",
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const certificateTypeDetailsSlice = createSlice({
  name: "certificateTypeDetailsSlice",
  initialState,
  reducers: {
    setInitialized: (
      state,
      action: PayloadAction<{ isInitialized: boolean }>
    ) => {
      state._isInitialized = action.payload.isInitialized
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение по id
      .addCase(getCertificateTypeByIdThunk.pending, (state, action) => {
        state.isFetching = true
        state.isSaving = false
        state.error = ""
        state.entityData = { name: "", hasGroups: false, durationAtMonths: 0 }
        state._isInitialized = false
      })
      .addCase(getCertificateTypeByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state._isInitialized = true
      })
      .addCase(getCertificateTypeByIdThunk.rejected, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = action.payload
        state.entityData = { name: "", hasGroups: false, durationAtMonths: 0 }
        state._isInitialized = true
      })
      .addCase(updateCertificateTypeThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
      })
  },
})

export const {
  actions: certificateTypeDetailsActions,
  reducer: certificateTypeDetailsReducer,
} = certificateTypeDetailsSlice
