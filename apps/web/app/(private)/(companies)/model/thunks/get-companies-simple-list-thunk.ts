"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ICompanyEntity } from "../types/ICompanyEntity"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"

export interface GetCompaniesSimpleListThunkProps {
  replaceData?: boolean
}

export const getCompaniesSimpleListThunk = createAsyncThunk<
  ResponseData<ICompanyEntity[] | undefined>,
  GetCompaniesSimpleListThunkProps,
  ThunkConfig<string>
>("getCompaniesSimpleListThunk", async (_, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    // Отправляем запрос
    const response = await apiClient(`/companies`, { method: "GET" })

    const data = response.data as ResponseData<ICompanyEntity[] | undefined>

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
