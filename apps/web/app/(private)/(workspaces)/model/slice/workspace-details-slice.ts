"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { Workspace } from "../types/workspace.schema"
import { getWorkspaceByIdThunk } from "../thunks/get-workspace-by-id-thunk"
import { updateWorkspaceThunk } from "../thunks/update-workspace.thunk"

const initialState: DetailsReduxSchema<Workspace> = {
  entityData: { company: { name: "" } },
  error: "",
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const workspaceDetailsSlice = createSlice({
  name: "workspaceDetailsSlice",
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
      .addCase(getWorkspaceByIdThunk.pending, (state, action) => {
        state.isFetching = true
        state.isSaving = false
        state.error = ""
        state.entityData = { company: { name: "" } }
        state._isInitialized = false
      })
      .addCase(getWorkspaceByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state._isInitialized = true
      })
      .addCase(getWorkspaceByIdThunk.rejected, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = action.payload
        state.entityData = { company: { name: "" } }
        state._isInitialized = true
      })
      .addCase(updateWorkspaceThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = {
          ...state.entityData,
          company: {
            id: action.payload.data?.company.id!,
            name: action.payload.data?.company.name!,
          },
        }
        state._isInitialized = true
      })
  },
})

export const {
  actions: workspaceDetailsActions,
  reducer: workspaceDetailsReducer,
} = workspaceDetailsSlice
