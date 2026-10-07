"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { Department } from "../types/department.schema"

export interface GetDepartmentByIdThunkProps {
  departmentId: string
}

export const getDepartmentByIdThunk = createAsyncThunk<
  ResponseData<Department | undefined>,
  GetDepartmentByIdThunkProps,
  ThunkConfig<string>
>("getDepartmentByIdThunk", async (props, thunkApi) => {
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
      `/workspaces/${activeWorkspaceId}/departments/${props.departmentId}`,
      {
        method: "GET",
      }
    )

    const data = response.data as ResponseData<Department | undefined>

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
