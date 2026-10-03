"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { BerthType } from "../types/berth-type.schema"

export interface DeleteBerthTypeThunkProps {
  berthTypeId: string
  workspaceId: string
}

export const deleteBerthTypeThunk = createAsyncThunk<
  ResponseData<BerthType | undefined>,
  DeleteBerthTypeThunkProps,
  ThunkConfig<string>
>("deleteBerthTypeThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient(
      `/workspaces/${props.workspaceId}/berth-types/${props.berthTypeId}`,
      {
        method: "DELETE",
      }
    )

    const deletedEntity = response.data as ResponseData<BerthType | undefined>

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
