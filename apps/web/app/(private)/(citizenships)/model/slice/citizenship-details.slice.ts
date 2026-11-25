"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { Citizenship } from "../types/citizenship.schema"
import { getCitizenshipByIdThunk } from "../thunks/get-citizenship-by-id.thunk"
import { updateCitizenshipThunk } from "../thunks/update-citizenship.thunk"

const initialState: DetailsReduxSchema<Citizenship> = {
  entityData: { name: "" },
  error: "",
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const citizenshipDetailsSlice = createSlice({
  name: "citizenshipDetailsSlice",
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
      .addCase(getCitizenshipByIdThunk.pending, (state, action) => {
        state.isFetching = true
        state.isSaving = false
        state.error = ""
        state.entityData = {
          name: "",
        }
        state._isInitialized = false
      })
      .addCase(getCitizenshipByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state._isInitialized = true
      })
      .addCase(getCitizenshipByIdThunk.rejected, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = action.payload
        state.entityData = {
          name: "",
        }
        state._isInitialized = true
      })
      .addCase(updateCitizenshipThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
      })
  },
})

export const {
  actions: citizenshipDetailsActions,
  reducer: citizenshipDetailsReducer,
} = citizenshipDetailsSlice
