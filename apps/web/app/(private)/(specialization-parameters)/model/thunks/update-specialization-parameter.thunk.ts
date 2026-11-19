"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { SpecializationParameter } from "../types/specialization-parameter.schema"

export interface UpdateSpecializationParameterThunkProps {
  entityData: SpecializationParameter
  workspaceId: string
}

export const updateSpecializationParameterThunk = createAsyncThunk<
  ResponseData<SpecializationParameter | undefined>,
  UpdateSpecializationParameterThunkProps,
  ThunkConfig<string>
>("updateSpecializationParameterThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    console.log("Thunk", props.entityData)

    const response = await apiClient(
      `/workspaces/${props.workspaceId}/specialization-parameters/${props.entityData.id}`,
      {
        method: "PATCH",
        data: formData,
      }
    )

    const updatedEntity = response.data as ResponseData<
      SpecializationParameter | undefined
    >

    if (!updatedEntity.isOk) {
      return rejectWithValue(ResponseData.getAllErrors(updatedEntity))
    }

    return updatedEntity
  } catch (error) {
    return rejectWithValue(
      ResponseData.InternalServerError(error).getAllErrors()
    )
  }
})
