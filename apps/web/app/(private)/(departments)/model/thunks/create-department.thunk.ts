"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { Department } from "../types/department.schema"

export interface CreateDepartmentThunkProps {
  entityData: Department
  workspaceId: string
}

export const createDepartmentThunk = createAsyncThunk<
  ResponseData<Department | undefined>,
  CreateDepartmentThunkProps,
  ThunkConfig<string>
>("createDepartmentThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(
      `/workspaces/${props.workspaceId}/departments/create`,
      {
        method: "POST",
        data: formData,
      }
    )

    const createdEntity = response.data as ResponseData<Department | undefined>

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
