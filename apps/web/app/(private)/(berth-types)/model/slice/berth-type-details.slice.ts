"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { BerthType } from "../types/berth-type.schema"
import { getBerthTypeByIdThunk } from "../thunks/get-berth-type-by-id.thunk"
import { updateBerthTypeThunk } from "../thunks/update-berth-type.thunk"

const initialState: DetailsReduxSchema<BerthType> = {
  entityData: { name: "" },
  error: "",
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const berthTypeDetailsSlice = createSlice({
  name: "berthTypeDetailsSlice",
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
      .addCase(getBerthTypeByIdThunk.pending, (state, action) => {
        state.isFetching = true
        state.isSaving = false
        state.error = ""
        state.entityData = {
          name: "",
        }
        state._isInitialized = false
      })
      .addCase(getBerthTypeByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state._isInitialized = true
      })
      .addCase(getBerthTypeByIdThunk.rejected, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = action.payload
        state.entityData = {
          name: "",
        }
        state._isInitialized = true
      })
      .addCase(updateBerthTypeThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
      })
  },
})

export const {
  actions: berthTypeDetailsActions,
  reducer: berthTypeDetailsReducer,
} = berthTypeDetailsSlice
