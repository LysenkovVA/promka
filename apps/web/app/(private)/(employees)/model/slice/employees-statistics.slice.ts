"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { EmployeesStatistics } from "../types/employees-statistics"
import { getEmployeesStatisticsThunk } from "@/Employees/model/thunks/get-employees-statistics.thunk"
import { createEmployeeThunk } from "../thunks/create-employee.thunk"
import { deleteEmployeeThunk } from "../thunks/delete-employee.thunk"

const initialState: DetailsReduxSchema<EmployeesStatistics> = {
  entityData: { count: 0 },
  error: "",
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const employeesStatisticsSlice = createSlice({
  name: "employeesStatisticsSlice",
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
      .addCase(getEmployeesStatisticsThunk.pending, (state, action) => {
        state.isFetching = true
        state.isSaving = false
        state.error = ""
        state.entityData = {
          count: 0,
        }
        state._isInitialized = false
      })
      .addCase(getEmployeesStatisticsThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state._isInitialized = true
      })
      .addCase(getEmployeesStatisticsThunk.rejected, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = action.payload
        state.entityData = {
          count: 0,
        }
        state._isInitialized = true
      })
      .addCase(createEmployeeThunk.fulfilled, (state, action) => {
        if (state.entityData) {
          state.entityData.count += 1
        }
      })
      .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
        if (state.entityData) {
          state.entityData.count -= 1
        }
      })
  },
})

export const {
  actions: employeesStatisticsActions,
  reducer: employeesStatisticsReducer,
} = employeesStatisticsSlice
