"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { Certificate } from "../types/certificate.schema"
import { getCertificateByIdThunk } from "../thunks/get-certificate-by-id.thunk"
import { updateCertificateThunk } from "../thunks/update-certificate.thunk"
import dayjs from "dayjs"

const initialState: DetailsReduxSchema<Certificate> = {
  entityData: {
    number: "",
    date: dayjs(new Date()).toDate(),
    certificateType: { name: "", hasGroups: false, durationAtMonths: 0 },
    employee: { surname: "" },
  },
  error: "",
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const certificateDetailsSlice = createSlice({
  name: "certificateDetailsSlice",
  initialState,
  reducers: {
    setInitialized: (
      state,
      action: PayloadAction<{ isInitialized: boolean }>
    ) => {
      state._isInitialized = action.payload.isInitialized
    },
    setEntityData: (state, action: PayloadAction<Certificate>) => {
      state.entityData = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение по id
      .addCase(getCertificateByIdThunk.pending, (state, action) => {
        state.isFetching = true
        state.isSaving = false
        state.error = ""
        state.entityData = {
          number: "",
          date: dayjs(new Date()).toDate(),
          certificateType: { name: "", hasGroups: false, durationAtMonths: 0 },
          employee: { surname: "" },
        }
        state._isInitialized = false
      })
      .addCase(getCertificateByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state._isInitialized = true
      })
      .addCase(getCertificateByIdThunk.rejected, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = action.payload
        state.entityData = {
          number: "",
          date: dayjs(new Date()).toDate(),
          certificateType: { name: "", hasGroups: false, durationAtMonths: 0 },
          employee: { surname: "" },
        }
        state._isInitialized = true
      })
      .addCase(updateCertificateThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
      })
  },
})

export const {
  actions: certificateDetailsActions,
  reducer: certificateDetailsReducer,
} = certificateDetailsSlice
