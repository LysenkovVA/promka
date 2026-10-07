"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { Department } from "../types/department.schema"

export interface UpdateDepartmentThunkProps {
  entityData: Department
  workspaceId: string
}

export const updateDepartmentThunk = createAsyncThunk<
  ResponseData<Department | undefined>,
  UpdateDepartmentThunkProps,
  ThunkConfig<string>
>("updateDepartmentThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(
      `/workspaces/${props.workspaceId}/departments/${props.entityData.id}`,
      {
        method: "PATCH",
        data: formData,
      }
    )

    const updatedEntity = response.data as ResponseData<Department | undefined>

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
