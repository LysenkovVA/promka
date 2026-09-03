"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { Employee } from "../types/employee.schema"

export interface DeleteEmployeeThunkProps {
  employeeId: string
  workspaceId: string
}

export const deleteEmployeeThunk = createAsyncThunk<
  ResponseData<Employee | undefined>,
  DeleteEmployeeThunkProps,
  ThunkConfig<string>
>("deleteEmployeeThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient(
      `/workspaces/${props.workspaceId}/employees/${props.employeeId}`,
      {
        method: "DELETE",
      }
    )

    const deletedEntity = response.data as ResponseData<Employee | undefined>

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
