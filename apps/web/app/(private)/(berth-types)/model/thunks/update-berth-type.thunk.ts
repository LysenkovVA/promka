"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { BerthType } from "../types/berth-type.schema"

export interface UpdateBerthTypeThunkProps {
  entityData: BerthType
  workspaceId: string
}

export const updateBerthTypeThunk = createAsyncThunk<
  ResponseData<BerthType | undefined>,
  UpdateBerthTypeThunkProps,
  ThunkConfig<string>
>("updateBerthTypeThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(
      `/workspaces/${props.workspaceId}/berth-types/${props.entityData.id}`,
      {
        method: "PATCH",
        data: formData,
      }
    )

    const updatedEntity = response.data as ResponseData<BerthType | undefined>

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
