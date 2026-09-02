"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { Employee } from "@/Employees"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import { TAKE } from "@/config/app"
import { QueryParamsGenerator } from "@/lib/url/searchParams"
import apiClient from "@/lib/axios/apiClient"

export interface GetEmployeesThunkProps {
  replaceData?: boolean
}

export const getEmployeesThunk = createAsyncThunk<
  ResponseData<Employee[] | undefined>,
  GetEmployeesThunkProps,
  ThunkConfig<string>
>("getEmployeesThunk", async (props, thunkApi) => {
  const { rejectWithValue, getState } = thunkApi

  try {
    // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
    // useSelector будет выдавать ошибку
    const state = getState()

    const activeWorkspaceId = state.authSchema?.entityData?.activeWorkspaceId

    if (!activeWorkspaceId) {
      rejectWithValue("No active workspace id found")
    }

    const take = state.employeesSchema?.take ?? TAKE
    const skip = state.employeesSchema?.skip ?? 0
    const search = state.employeesSchema?.search
    // TODO
    //const filters = state.employeesSchema?.filters

    const queryParameters = new QueryParamsGenerator()
      .setOne("search", search)
      .setOne("skip", skip?.toString())
      .setOne("take", take?.toString())

    // Отправляем запрос
    const response = await apiClient(
      `/workspaces/${activeWorkspaceId}/employees${queryParameters.toString()}`,
      {
        method: "GET",
      }
    )

    const data = response.data as ResponseData<Employee[] | undefined>

    if (!data.isOk) {
      return rejectWithValue(ResponseData.getAllErrors(data))
    }

    return data
  } catch (error) {
    // Неизвестная ошибка в thunk-е
    return rejectWithValue(
      ResponseData.InternalServerError(error).getAllErrors()
    )
  }
})
