"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { IEmployeeEntity } from "../types/IEmployeeEntity"

export interface UpsertEmployeeThunkProps {
  entityData: IEmployeeEntity
  workspaceId: string
}

export const upsertEmployeeThunk = createAsyncThunk<
  ResponseData<IEmployeeEntity | undefined>,
  UpsertEmployeeThunkProps,
  ThunkConfig<string>
>("upsertEmployeeThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(
      `/employees/upsert?workspaceId=${props.workspaceId}`,
      {
        method: "POST",
        data: formData,
      }
    )

    const createdEntity = response.data as ResponseData<
      IEmployeeEntity | undefined
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
