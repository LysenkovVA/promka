"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { Employee } from "../types/employee.schema"
import { getEmployeeByIdThunk } from "../thunks/get-employee-by-id.thunk"
import { updateEmployeeThunk } from "../thunks/update-employee.thunk"

const initialState: DetailsReduxSchema<Employee> = {
  entityData: { surname: "" },
  entityFormData: { surname: "" },
  error: "",
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const employeeDetailsSlice = createSlice({
  name: "employeeDetailsSlice",
  initialState,
  reducers: {
    setInitialized: (
      state,
      action: PayloadAction<{ isInitialized: boolean }>
    ) => {
      state._isInitialized = action.payload.isInitialized
    },
    setFormData: (state, action: PayloadAction<{ data: Employee }>) => {
      state.entityFormData = action.payload.data
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение по id
      .addCase(getEmployeeByIdThunk.pending, (state, action) => {
        state.isFetching = true
        state.isSaving = false
        state.error = ""
        state.entityData = {
          surname: "",
        }
        state.entityFormData = {
          surname: "",
        }
        state._isInitialized = false
      })
      .addCase(getEmployeeByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state.entityFormData = action.payload.data!
        state._isInitialized = true
      })
      .addCase(getEmployeeByIdThunk.rejected, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = action.payload
        state.entityData = {
          surname: "",
        }
        state.entityFormData = {
          surname: "",
        }
        state._isInitialized = true
      })
      .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state.entityFormData = action.payload.data!
      })
    // .addCase(upsertEmployeeThunk.pending, (state, action) => {
    //   state.isFetching = false
    //   state.isSaving = true
    //   state.error = ""
    // })
    // .addCase(upsertEmployeeThunk.fulfilled, (state, action) => {
    //   state.isFetching = false
    //   state.isSaving = false
    //   state.error = ""
    //   state.entityData = action.payload.data!
    //   state.entityFormData = action.payload.data!
    // })
    // .addCase(upsertEmployeeThunk.rejected, (state, action) => {
    //   state.isFetching = false
    //   state.isSaving = false
    //   state.error = action.payload
    // })
  },
})

export const {
  actions: employeeDetailsActions,
  reducer: employeeDetailsReducer,
} = employeeDetailsSlice
