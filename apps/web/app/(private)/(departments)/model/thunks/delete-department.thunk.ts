"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { Department } from "../types/department.schema"

export interface DeleteDepartmentThunkProps {
  departmentId: string
  workspaceId: string
}

export const deleteDepartmentThunk = createAsyncThunk<
  ResponseData<Department | undefined>,
  DeleteDepartmentThunkProps,
  ThunkConfig<string>
>("deleteDepartmentThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient(
      `/workspaces/${props.workspaceId}/departments/${props.departmentId}`,
      {
        method: "DELETE",
      }
    )

    const deletedEntity = response.data as ResponseData<Department | undefined>

    if (!deletedEntity.isOk) {
      return rejectWithValue(ResponseData.getAllErrors(deletedEntity))
    }

    return deletedEntity
  } catch (error) {
    return rejectWithValue(
      ResponseData.InternalServerError(error).getAllErrors()
    )
  }
})
