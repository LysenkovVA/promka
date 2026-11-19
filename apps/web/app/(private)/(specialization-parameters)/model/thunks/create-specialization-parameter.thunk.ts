"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { SpecializationParameter } from "../types/specialization-parameter.schema"

export interface CreateSpecializationParameterThunkProps {
  entityData: SpecializationParameter
  workspaceId: string
}

export const createSpecializationParameterThunk = createAsyncThunk<
  ResponseData<SpecializationParameter | undefined>,
  CreateSpecializationParameterThunkProps,
  ThunkConfig<string>
>("createSpecializationParameterThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(
      `/workspaces/${props.workspaceId}/specialization-parameters/create`,
      {
        method: "POST",
        data: formData,
      }
    )

    const createdEntity = response.data as ResponseData<
      SpecializationParameter | undefined
    >

    if (!createdEntity.isOk) {
      return rejectWithValue(ResponseData.getAllErrors(createdEntity))
    }

    return createdEntity
  } catch (error) {
    return rejectWithValue(
      ResponseData.InternalServerError(error).getAllErrors()
    )
  }
})
