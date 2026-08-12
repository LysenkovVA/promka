"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { IEmployeeEntity } from "../types/IEmployeeEntity"

export interface DeleteEmployeeByIdThunkProps {
  id: string
}

export const deleteEmployeeByIdThunk = createAsyncThunk<
  ResponseData<IEmployeeEntity | undefined>,
  DeleteEmployeeByIdThunkProps,
  ThunkConfig<string>
>("deleteEmployeeByIdThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient(`/employees/${props.id}`, {
      method: "DELETE",
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
