"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { SpecializationDirection } from "../types/specialization-direction.schema"

export interface UpdateSpecializationDirectionThunkProps {
  entityData: SpecializationDirection
  workspaceId: string
}

export const updateSpecializationDirectionThunk = createAsyncThunk<
  ResponseData<SpecializationDirection | undefined>,
  UpdateSpecializationDirectionThunkProps,
  ThunkConfig<string>
>("updateSpecializationDirectionThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    console.log("Thunk", props.entityData)

    const response = await apiClient(
      `/workspaces/${props.workspaceId}/certificate-type-directions/${props.entityData.id}`,
      {
        method: "PATCH",
        data: formData,
      }
    )

    const updatedEntity = response.data as ResponseData<
      SpecializationDirection | undefined
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
