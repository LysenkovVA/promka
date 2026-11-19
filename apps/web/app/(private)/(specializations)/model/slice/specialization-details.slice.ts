"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { Specialization } from "../types/specialization.schema"
import { getSpecializationByIdThunk } from "../thunks/get-specialization-by-id.thunk"
import { updateSpecializationThunk } from "../thunks/update-specialization.thunk"

const initialState: DetailsReduxSchema<Specialization> = {
  entityData: {
    durationAtMonths: 0,
    hasParameter: false,
    validAtOrganizationOnly: false,
  },
  error: "",
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const specializationDetailsSlice = createSlice({
  name: "specializationDetailsSlice",
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
      .addCase(getSpecializationByIdThunk.pending, (state, action) => {
        state.isFetching = true
        state.isSaving = false
        state.error = ""
        state.entityData = {
          durationAtMonths: 0,
          hasParameter: false,
          validAtOrganizationOnly: false,
        }
        state._isInitialized = false
      })
      .addCase(getSpecializationByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state._isInitialized = true
      })
      .addCase(getSpecializationByIdThunk.rejected, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = action.payload
        state.entityData = {
          durationAtMonths: 0,
          hasParameter: false,
          validAtOrganizationOnly: false,
        }
        state._isInitialized = true
      })
      .addCase(updateSpecializationThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
      })
  },
})

export const {
  actions: specializationDetailsActions,
  reducer: specializationDetailsReducer,
} = specializationDetailsSlice
