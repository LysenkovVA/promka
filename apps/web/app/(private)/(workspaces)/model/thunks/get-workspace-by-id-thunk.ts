"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import apiClient from "@/lib/axios/apiClient"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import { Workspace } from "../types/workspace.schema"

export interface GetWorkspaceByIdThunkProps {
  id: string
}

export const getWorkspaceByIdThunk = createAsyncThunk<
  ResponseData<Workspace | undefined>,
  GetWorkspaceByIdThunkProps,
  ThunkConfig<string>
>("getWorkspaceByIdThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    // await simulateDelay(3000)
    const response = await apiClient(`/workspaces/${props.id}`, {
      method: "GET",
    })

    const data = response.data as ResponseData<Workspace | undefined>

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
