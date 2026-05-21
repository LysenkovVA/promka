"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ILoginSchema } from "@/app/(auth)/model/types/ILoginSchema"
import { IAuthData } from "@/app/(auth)/model/types/IAuthData"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"

export const loginThunk = createAsyncThunk<
  IAuthData,
  ILoginSchema,
  ThunkConfig<string>
>("loginThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient.post("/login", {
      ...props,
    })

    const responseData = response?.data as ResponseData<IAuthData>

    if (!responseData.isOk) {
      return rejectWithValue(ResponseData.getAllErrors(responseData))
    }

    if (!responseData.data) {
      return rejectWithValue("Данные пользователя не получены")
    }

    return responseData.data
  } catch (error: any) {
    // Извлекаем данные из error.response при 403, 401 и т.д.
    const response = error.response

    if (response) {
      console.log("Ошибка ответа:", response?.status, response?.data)

      const responseData = response?.data

      // Если сервер вернул структурированный ответ с ошибками
      if (responseData && typeof responseData === "object") {
        if (responseData?.isOk === false) {
          return rejectWithValue(ResponseData.getAllErrors(responseData))
        }
        // Иногда ошибка приходит без isOk, но с message
        if (responseData?.message) {
          return rejectWithValue(responseData.message)
        }
      }

      // fallback: просто сообщаем о статусе
      return rejectWithValue(`Код ошибки: ${response.status ?? "не определен"}`)
    }

    // Сетевая ошибка или другая проблема
    return rejectWithValue(
      ResponseData.InternalServerError(error).getAllErrors()
    )
  }
})
