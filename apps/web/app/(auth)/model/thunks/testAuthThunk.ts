"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { toast } from "sonner"

export const testAuthThunk = createAsyncThunk<
  string,
  void,
  ThunkConfig<string>
>("testAuthThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient.post("/test-auth")

    const responseData = response?.data as ResponseData<string>

    if (response.data.status === 401 || response.data.status === 403) {
      toast.error(response.status)
    }

    if (!responseData.isOk) {
      return rejectWithValue(ResponseData.getAllErrors(responseData))
    }

    if (!responseData.data) {
      return rejectWithValue("Ошибка тестового запроса")
    }

    toast.info(JSON.stringify(responseData.data))

    return responseData.data
  } catch (error) {
    // Неизвестная ошибка в thunk-е
    return rejectWithValue(
      ResponseData.InternalServerError(error).getAllErrors()
    )
  }
})
