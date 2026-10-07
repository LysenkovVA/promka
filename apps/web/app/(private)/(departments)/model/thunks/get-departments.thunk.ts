"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import { TAKE } from "@/config/app"
import { QueryParamsGenerator } from "@/lib/url/searchParams"
import apiClient from "@/lib/axios/apiClient"
import { Department } from "../types/department.schema"

export interface GetDepartmentsThunkProps {
  replaceData?: boolean
}

export const getDepartmentsThunk = createAsyncThunk<
  ResponseData<Department[] | undefined>,
  GetDepartmentsThunkProps,
  ThunkConfig<string>
>("getDepartmentsThunk", async (props, thunkApi) => {
  const { rejectWithValue, getState } = thunkApi

  try {
    // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
    // useSelector будет выдавать ошибку
    const state = getState()

    const activeWorkspaceId = state.authSchema?.entityData?.activeWorkspaceId

    if (!activeWorkspaceId) {
      rejectWithValue("No active workspace id found")
    }

    const take = state.departmentsSchema?.take ?? TAKE
    const skip = state.departmentsSchema?.skip ?? 0
    const search = state.departmentsSchema?.search
    // TODO
    //const filters = state.berthsSchema?.filters

    const queryParameters = new QueryParamsGenerator()
      .setOne("search", search)
      .setOne("skip", skip?.toString())
      .setOne("take", take?.toString())

    // Отправляем запрос
    const response = await apiClient(
      `/workspaces/${activeWorkspaceId}/departments${queryParameters.toString()}`,
      {
        method: "GET",
      }
    )

    const data = response.data as ResponseData<Department[] | undefined>

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
