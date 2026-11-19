"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { Protocol } from "../types/protocol.schema"
import { getProtocolByIdThunk } from "../thunks/get-protocol-by-id.thunk"
import { updateProtocolThunk } from "../thunks/update-protocol.thunk"

const initialState: DetailsReduxSchema<Protocol> = {
  entityData: { number: "", date: new Date(), studies: [] },
  error: "",
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const protocolDetailsSlice = createSlice({
  name: "protocolDetailsSlice",
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
      .addCase(getProtocolByIdThunk.pending, (state, action) => {
        state.isFetching = true
        state.isSaving = false
        state.error = ""
        state.entityData = { number: "", date: new Date(), studies: [] }
        state._isInitialized = false
      })
      .addCase(getProtocolByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state._isInitialized = true
      })
      .addCase(getProtocolByIdThunk.rejected, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = action.payload
        state.entityData = { number: "", date: new Date(), studies: [] }
        state._isInitialized = true
      })
      .addCase(updateProtocolThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
      })
  },
})

export const {
  actions: protocolDetailsActions,
  reducer: protocolDetailsReducer,
} = protocolDetailsSlice
