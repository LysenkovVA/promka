"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import apiClient from "@/lib/axios/apiClient"
import { ResponseData } from "@/lib/responses/ResponseData"
import { IEmployeeEntity } from "../types/IEmployeeEntity"
import { ThunkConfig } from "@/lib/redux"

export interface GetEmployeeByIdThunkProps {
  id: string
}

export const getEmployeeByIdThunk = createAsyncThunk<
  ResponseData<IEmployeeEntity | undefined>,
  GetEmployeeByIdThunkProps,
  ThunkConfig<string>
>("getEmployeeByIdThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient(`/employees/${props.id}`, {
      method: "GET",
    })

    const data = response.data as ResponseData<IEmployeeEntity | undefined>

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
