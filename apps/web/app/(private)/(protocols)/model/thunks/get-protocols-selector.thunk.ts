"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { Protocol } from "../types/protocol.schema"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import { TAKE } from "@/config/app"
import { QueryParamsGenerator } from "@/lib/url/searchParams"
import apiClient from "@/lib/axios/apiClient"

export interface GetProtocolsSelectorThunkProps {
  replaceData?: boolean
}

export const getProtocolsSelectorThunk = createAsyncThunk<
  ResponseData<Protocol[] | undefined>,
  GetProtocolsSelectorThunkProps,
  ThunkConfig<string>
>("getProtocolsSelectorThunk", async (props, thunkApi) => {
  const { rejectWithValue, getState } = thunkApi

  try {
    // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
    // useSelector будет выдавать ошибку
    const state = getState()

    const activeWorkspaceId = state.authSchema?.entityData?.activeWorkspaceId

    if (!activeWorkspaceId) {
      rejectWithValue("No active workspace id found")
    }

    const take = state.protocolsSelectorSchema?.take ?? TAKE
    const skip = state.protocolsSelectorSchema?.skip ?? 0
    const search = state.protocolsSelectorSchema?.search
    // TODO
    //const filters = state.protocolsSchema?.filters

    const queryParameters = new QueryParamsGenerator()
      .setOne("search", search)
      .setOne("skip", skip?.toString())
      .setOne("take", take?.toString())

    // Отправляем запрос
    const response = await apiClient(
      `/workspaces/${activeWorkspaceId}/protocols${queryParameters.toString()}`,
      {
        method: "GET",
      }
    )

    const data = response.data as ResponseData<Protocol[] | undefined>

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
