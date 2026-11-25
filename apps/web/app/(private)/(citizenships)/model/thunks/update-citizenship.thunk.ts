"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { Citizenship } from "../types/citizenship.schema"

export interface UpdateCitizenshipThunkProps {
  entityData: Citizenship
  workspaceId: string
}

export const updateCitizenshipThunk = createAsyncThunk<
  ResponseData<Citizenship | undefined>,
  UpdateCitizenshipThunkProps,
  ThunkConfig<string>
>("updateCitizenshipThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(
      `/workspaces/${props.workspaceId}/citizenships/${props.entityData.id}`,
      {
        method: "PATCH",
        data: formData,
      }
    )

    const updatedEntity = response.data as ResponseData<Citizenship | undefined>

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
