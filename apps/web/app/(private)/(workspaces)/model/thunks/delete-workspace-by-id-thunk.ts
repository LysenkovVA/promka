"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { Workspace } from "../types/workspace.schema"

export interface DeleteWorkspaceByIdThunkProps {
  id: string
}

export const deleteWorkspaceByIdThunk = createAsyncThunk<
  ResponseData<Workspace | undefined>,
  DeleteWorkspaceByIdThunkProps,
  ThunkConfig<string>
>("deleteWorkspaceByIdThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient(`/workspaces/${props.id}`, {
      method: "DELETE",
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
