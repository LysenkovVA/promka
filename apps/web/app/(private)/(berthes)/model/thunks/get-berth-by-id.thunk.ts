"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { Berth } from "../types/berth.schema"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"

export interface GetBerthByIdThunkProps {
  berthId: string
}

export const getBerthByIdThunk = createAsyncThunk<
  ResponseData<Berth | undefined>,
  GetBerthByIdThunkProps,
  ThunkConfig<string>
>("getBerthByIdThunk", async (props, thunkApi) => {
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
      `/workspaces/${activeWorkspaceId}/berthes/${props.berthId}`,
      {
        method: "GET",
      }
    )

    const data = response.data as ResponseData<Berth | undefined>

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
