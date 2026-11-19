"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { SpecializationParameter } from "../types/specialization-parameter.schema"

export interface DeleteSpecializationParameterThunkProps {
  specializationParameterId: string
  workspaceId: string
}

export const deleteSpecializationParameterThunk = createAsyncThunk<
  ResponseData<SpecializationParameter | undefined>,
  DeleteSpecializationParameterThunkProps,
  ThunkConfig<string>
>("deleteSpecializationParameterThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient(
      `/workspaces/${props.workspaceId}/specialization-parameters/${props.specializationParameterId}`,
      {
        method: "DELETE",
      }
    )

    const deletedEntity = response.data as ResponseData<
      SpecializationParameter | undefined
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
