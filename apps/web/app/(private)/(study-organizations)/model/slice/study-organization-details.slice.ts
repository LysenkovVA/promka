"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { StudyOrganization } from "../types/study-organization.schema"
import { getStudyOrganizationByIdThunk } from "../thunks/get-study-organization-by-id.thunk"
import { updateStudyOrganizationThunk } from "../thunks/update-study-organization.thunk"

const initialState: DetailsReduxSchema<StudyOrganization> = {
  entityData: { name: "" },
  error: "",
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const studyOrganizationDetailsSlice = createSlice({
  name: "studyOrganizationDetailsSlice",
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
      .addCase(getStudyOrganizationByIdThunk.pending, (state, action) => {
        state.isFetching = true
        state.isSaving = false
        state.error = ""
        state.entityData = {
          name: "",
        }
        state._isInitialized = false
      })
      .addCase(getStudyOrganizationByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state._isInitialized = true
      })
      .addCase(getStudyOrganizationByIdThunk.rejected, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = action.payload
        state.entityData = {
          name: "",
        }
        state._isInitialized = true
      })
      .addCase(updateStudyOrganizationThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
      })
  },
})

export const {
  actions: studyOrganizationDetailsActions,
  reducer: studyOrganizationDetailsReducer,
} = studyOrganizationDetailsSlice
