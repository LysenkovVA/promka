"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { Workspace } from "../types/workspace.schema"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import { TAKE } from "@/config/app"
import { QueryParamsGenerator } from "@/lib/url/searchParams"
import apiClient from "@/lib/axios/apiClient"

export interface GetWorkspacesThunkProps {
  replaceData?: boolean
}

export const getWorkspacesThunk = createAsyncThunk<
  ResponseData<Workspace[] | undefined>,
  GetWorkspacesThunkProps,
  ThunkConfig<string>
>("getWorkspacesThunk", async (props, thunkApi) => {
  const { rejectWithValue, getState } = thunkApi

  try {
    // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
    // useSelector будет выдавать ошибку
    const state = getState()

    // const activeWorkspaceId = state.authSchema?.entityData?.activeWorkspaceId
    //
    // if (!activeWorkspaceId) {
    //   rejectWithValue("No active workspace id found")
    // }

    const take = state.workspacesSchema?.take ?? TAKE
    const skip = state.workspacesSchema?.skip ?? 0
    const search = state.workspacesSchema?.search

    const queryParameters = new QueryParamsGenerator()
      .setOne("search", search)
      .setOne("skip", skip?.toString())
      .setOne("take", take?.toString())

    // Отправляем запрос
    const response = await apiClient(
      `/workspaces${queryParameters.toString()}`,
      {
        method: "GET",
      }
    )

    const data = response.data as ResponseData<Workspace[] | undefined>

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
