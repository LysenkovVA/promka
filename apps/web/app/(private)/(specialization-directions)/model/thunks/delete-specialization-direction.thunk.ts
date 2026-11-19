"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { SpecializationDirection } from "../types/specialization-direction.schema"

export interface DeleteSpecializationDirectionThunkProps {
  specializationDirectionId: string
  workspaceId: string
}

export const deleteSpecializationDirectionThunk = createAsyncThunk<
  ResponseData<SpecializationDirection | undefined>,
  DeleteSpecializationDirectionThunkProps,
  ThunkConfig<string>
>("deleteSpecializationDirectionThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient(
      `/workspaces/${props.workspaceId}/specialization-directions/${props.specializationDirectionId}`,
      {
        method: "DELETE",
      }
    )

    const deletedEntity = response.data as ResponseData<
      SpecializationDirection | undefined
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
