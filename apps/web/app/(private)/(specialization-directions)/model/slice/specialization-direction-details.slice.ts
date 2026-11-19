"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { SpecializationDirection } from "../types/specialization-direction.schema"
import { getSpecializationDirectionByIdThunk } from "../thunks/get-specialization-direction-by-id.thunk"
import { updateSpecializationDirectionThunk } from "../thunks/update-specialization-direction.thunk"

const initialState: DetailsReduxSchema<SpecializationDirection> = {
  entityData: {
    name: "",
  },
  error: "",
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const specializationDirectionDirectionDetailsSlice = createSlice({
  name: "specializationDirectionDetailsSlice",
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
      .addCase(getSpecializationDirectionByIdThunk.pending, (state, action) => {
        state.isFetching = true
        state.isSaving = false
        state.error = ""
        state.entityData = {
          name: "",
        }
        state._isInitialized = false
      })
      .addCase(
        getSpecializationDirectionByIdThunk.fulfilled,
        (state, action) => {
          state.isFetching = false
          state.isSaving = false
          state.error = ""
          state.entityData = action.payload.data!
          state._isInitialized = true
        }
      )
      .addCase(
        getSpecializationDirectionByIdThunk.rejected,
        (state, action) => {
          state.isFetching = false
          state.isSaving = false
          state.error = action.payload
          state.entityData = {
            name: "",
          }
          state._isInitialized = true
        }
      )
      .addCase(
        updateSpecializationDirectionThunk.fulfilled,
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
  actions: specializationDirectionDetailsActions,
  reducer: specializationDirectionDetailsReducer,
} = specializationDirectionDirectionDetailsSlice
