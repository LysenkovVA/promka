"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { SpecializationDirection } from "../types/specialization-direction.schema"

export interface CreateSpecializationDirectionThunkProps {
  entityData: SpecializationDirection
  workspaceId: string
}

export const createSpecializationDirectionThunk = createAsyncThunk<
  ResponseData<SpecializationDirection | undefined>,
  CreateSpecializationDirectionThunkProps,
  ThunkConfig<string>
>("createSpecializationDirectionThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(
      `/workspaces/${props.workspaceId}/specialization-directions/create`,
      {
        method: "POST",
        data: formData,
      }
    )

    const createdEntity = response.data as ResponseData<
      SpecializationDirection | undefined
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
