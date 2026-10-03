"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { BerthType } from "../types/berth-type.schema"

export interface CreateBerthTypeThunkProps {
  entityData: BerthType
  workspaceId: string
}

export const createBerthTypeThunk = createAsyncThunk<
  ResponseData<BerthType | undefined>,
  CreateBerthTypeThunkProps,
  ThunkConfig<string>
>("createBerthTypeThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(
      `/workspaces/${props.workspaceId}/berth-types/create`,
      {
        method: "POST",
        data: formData,
      }
    )

    const createdEntity = response.data as ResponseData<BerthType | undefined>

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
