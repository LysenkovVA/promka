"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { SpecializationParameter } from "../types/specialization-parameter.schema"

export interface GetSpecializationParameterByIdThunkProps {
  specializationParameterId: string
}

export const getSpecializationParameterByIdThunk = createAsyncThunk<
  ResponseData<SpecializationParameter | undefined>,
  GetSpecializationParameterByIdThunkProps,
  ThunkConfig<string>
>("getSpecializationParameterByIdThunk", async (props, thunkApi) => {
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
      `/workspaces/${activeWorkspaceId}/specialization-parameters/${props.specializationParameterId}`,
      {
        method: "GET",
      }
    )

    const data = response.data as ResponseData<
      SpecializationParameter | undefined
    >

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
