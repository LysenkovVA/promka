"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { IAuthData } from "@/app/(auth)/model/types/IAuthData"

export const refreshThunk = createAsyncThunk<
  IAuthData,
  void,
  ThunkConfig<string>
>("refreshThunk", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.post("/refresh")

    const responseData = response?.data

    if (!responseData) {
      return rejectWithValue("Ответ от сервера пустой")
    }

    if (!responseData.isOk) {
      return rejectWithValue(ResponseData.getAllErrors(responseData))
    }

    if (!responseData.data) {
      return rejectWithValue(
        "Пользователь не был получен при обновлении access токена"
      )
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
