"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { Citizenship } from "../types/citizenship.schema"

export interface DeleteCitizenshipThunkProps {
  citizenshipId: string
  workspaceId: string
}

export const deleteCitizenshipThunk = createAsyncThunk<
  ResponseData<Citizenship | undefined>,
  DeleteCitizenshipThunkProps,
  ThunkConfig<string>
>("deleteCitizenshipThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient(
      `/workspaces/${props.workspaceId}/citizenships/${props.citizenshipId}`,
      {
        method: "DELETE",
      }
    )

    const deletedEntity = response.data as ResponseData<Citizenship | undefined>

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
