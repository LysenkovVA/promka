"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { Protocol } from "../types/protocol.schema"

export interface DeleteProtocolThunkProps {
  protocolId: string
  workspaceId: string
}

export const deleteProtocolThunk = createAsyncThunk<
  ResponseData<Protocol | undefined>,
  DeleteProtocolThunkProps,
  ThunkConfig<string>
>("deleteProtocolThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient(
      `/workspaces/${props.workspaceId}/protocols/${props.protocolId}`,
      {
        method: "DELETE",
      }
    )

    const deletedEntity = response.data as ResponseData<Protocol | undefined>

    if (!deletedEntity.isOk) {
      return rejectWithValue(ResponseData.getAllErrors(deletedEntity))
    }

    return deletedEntity
  } catch (error) {
    return rejectWithValue(
      ResponseData.InternalServerError(error).getAllErrors()
    )
  }
})
