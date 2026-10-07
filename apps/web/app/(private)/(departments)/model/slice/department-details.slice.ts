"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { Department } from "../types/department.schema"
import { getDepartmentByIdThunk } from "../thunks/get-department-by-id.thunk"
import { updateDepartmentThunk } from "../thunks/update-department.thunk"

const initialState: DetailsReduxSchema<Department> = {
  entityData: { name: "" },
  error: "",
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const departmentDetailsSlice = createSlice({
  name: "departmentDetailsSlice",
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
      .addCase(getDepartmentByIdThunk.pending, (state, action) => {
        state.isFetching = true
        state.isSaving = false
        state.error = ""
        state.entityData = {
          name: "",
        }
        state._isInitialized = false
      })
      .addCase(getDepartmentByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state._isInitialized = true
      })
      .addCase(getDepartmentByIdThunk.rejected, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = action.payload
        state.entityData = {
          name: "",
        }
        state._isInitialized = true
      })
      .addCase(updateDepartmentThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
      })
  },
})

export const {
  actions: departmentDetailsActions,
  reducer: departmentDetailsReducer,
} = departmentDetailsSlice
