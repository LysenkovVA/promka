"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { Workspace } from "@/Workspaces/model/types/workspace.schema"
import { getWorkspaceByIdThunk } from "@/Workspaces/model/thunks/get-workspace-by-id-thunk"

const initialState: DetailsReduxSchema<Workspace> = {
  entityData: { company: { name: "" } },
  entityFormData: { company: { name: "" } },
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
    setFormData: (state, action: PayloadAction<{ data: Workspace }>) => {
      state.entityFormData = action.payload.data
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
        state.entityFormData = { company: { name: "" } }
        state._isInitialized = false
      })
      .addCase(getWorkspaceByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state.entityFormData = action.payload.data!
        state._isInitialized = true
      })
      .addCase(getWorkspaceByIdThunk.rejected, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = action.payload
        state.entityData = { company: { name: "" } }
        state.entityFormData = { company: { name: "" } }
        state._isInitialized = true
      })
  },
})

export const {
  actions: workspaceDetailsActions,
  reducer: workspaceDetailsReducer,
} = workspaceDetailsSlice
