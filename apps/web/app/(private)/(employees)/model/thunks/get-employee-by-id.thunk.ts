"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { Employee } from "@/Employees"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"

export interface GetEmployeeByIdThunkProps {
  employeeId: string
}

export const getEmployeeByIdThunk = createAsyncThunk<
  ResponseData<Employee | undefined>,
  GetEmployeeByIdThunkProps,
  ThunkConfig<string>
>("getEmployeeByIdThunk", async (props, thunkApi) => {
  const { rejectWithValue, getState } = thunkApi

  try {
    // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
    // useSelector будет выдавать ошибку
    const state = getState()

    const activeWorkspaceId = state.authSchema?.entityData?.activeWorkspaceId

    if (!activeWorkspaceId) {
      rejectWithValue("No active workspace id found")
    }

    // Отправляем запрос
    const response = await apiClient(
      `/workspaces/${activeWorkspaceId}/employees/${props.employeeId}`,
      {
        method: "GET",
      }
    )

    const data = response.data as ResponseData<Employee | undefined>

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
