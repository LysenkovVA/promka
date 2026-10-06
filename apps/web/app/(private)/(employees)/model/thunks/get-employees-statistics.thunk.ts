"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { EmployeesStatistics } from "../types/employees-statistics"

export interface GetEmployeesStatisticsThunkProps {}

export const getEmployeesStatisticsThunk = createAsyncThunk<
  ResponseData<EmployeesStatistics | undefined>,
  GetEmployeesStatisticsThunkProps,
  ThunkConfig<string>
>("getEmployeesStatisticsThunk", async (props, thunkApi) => {
  const { rejectWithValue, getState } = thunkApi

  try {
    // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
    // useSelector будет выдавать ошибку
    const state = getState()

    const activeWorkspaceId = state.authSchema?.entityData?.activeWorkspaceId

    if (!activeWorkspaceId) {
      console.log("No active workspace id found")
      rejectWithValue("No active workspace id found")
    }

    console.log("activeWorkspaceId", activeWorkspaceId)

    // Отправляем запрос
    const response = await apiClient(
      `/workspaces/${activeWorkspaceId}/employees/statistics`,
      {
        method: "GET",
      }
    )

    const data = response.data as ResponseData<EmployeesStatistics | undefined>

    if (!data.isOk) {
      return rejectWithValue(ResponseData.getAllErrors(data))
    }

    return data
  } catch (error) {
    return rejectWithValue(
      ResponseData.InternalServerError(error).getAllErrors()
    )
  }
})
