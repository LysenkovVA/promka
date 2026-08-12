"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { IEmployeeEntity } from "../types/IEmployeeEntity"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"

export interface GetEmployeesSimpleListThunkProps {
  replaceData?: boolean
  workspaceId: string
}

export const getEmployeesSimpleListThunk = createAsyncThunk<
  ResponseData<IEmployeeEntity[] | undefined>,
  GetEmployeesSimpleListThunkProps,
  ThunkConfig<string>
>("getEmployeesSimpleListThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    // Отправляем запрос
    const response = await apiClient(
      `/employees?workspaceId=${props.workspaceId}`,
      { method: "GET" }
    )

    const data = response.data as ResponseData<IEmployeeEntity[] | undefined>

    if (!data.isOk) {
      return rejectWithValue(ResponseData.getAllErrors(data))
    }

    return data
  } catch (error) {
    return rejectWithValue(
      ResponseData.InternalServerError(error).getAllErrors()
    )
  }
})
