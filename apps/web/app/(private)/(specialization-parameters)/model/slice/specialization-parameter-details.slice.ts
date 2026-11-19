"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { SpecializationParameter } from "../types/specialization-parameter.schema"
import { getSpecializationParameterByIdThunk } from "../thunks/get-specialization-parameter-by-id.thunk"
import { updateSpecializationParameterThunk } from "../thunks/update-specialization-parameter.thunk"

const initialState: DetailsReduxSchema<SpecializationParameter> = {
  entityData: { name: "" },
  error: "",
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const specializationParameterParameterDetailsSlice = createSlice({
  name: "specializationParameterDetailsSlice",
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
      .addCase(getSpecializationParameterByIdThunk.pending, (state, action) => {
        state.isFetching = true
        state.isSaving = false
        state.error = ""
        state.entityData = { name: "" }
        state._isInitialized = false
      })
      .addCase(
        getSpecializationParameterByIdThunk.fulfilled,
        (state, action) => {
          state.isFetching = false
          state.isSaving = false
          state.error = ""
          state.entityData = action.payload.data!
          state._isInitialized = true
        }
      )
      .addCase(
        getSpecializationParameterByIdThunk.rejected,
        (state, action) => {
          state.isFetching = false
          state.isSaving = false
          state.error = action.payload
          state.entityData = { name: "" }
          state._isInitialized = true
        }
      )
      .addCase(
        updateSpecializationParameterThunk.fulfilled,
        (state, action) => {
          state.isFetching = false
          state.isSaving = false
          state.error = ""
          state.entityData = action.payload.data!
        }
      )
  },
})

export const {
  actions: specializationParameterDetailsActions,
  reducer: specializationParameterDetailsReducer,
} = specializationParameterParameterDetailsSlice
