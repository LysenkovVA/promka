"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { Specialization } from "../types/specialization.schema"

export interface DeleteSpecializationThunkProps {
  specializationId: string
  workspaceId: string
}

export const deleteSpecializationThunk = createAsyncThunk<
  ResponseData<Specialization | undefined>,
  DeleteSpecializationThunkProps,
  ThunkConfig<string>
>("deleteSpecializationThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient(
      `/workspaces/${props.workspaceId}/specializations/${props.specializationId}`,
      {
        method: "DELETE",
      }
    )

    const deletedEntity = response.data as ResponseData<
      Specialization | undefined
    >

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
