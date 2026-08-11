"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import apiClient from "@/lib/axios/apiClient"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ICompanyEntity } from "@/app/(private)/(companies)"
import { ThunkConfig } from "@/lib/redux"

export interface GetCompanyByIdThunkProps {
  id: string
}

export const getCompanyByIdThunk = createAsyncThunk<
  ResponseData<ICompanyEntity | undefined>,
  GetCompanyByIdThunkProps,
  ThunkConfig<string>
>("getCompanyByIdThunk", async (props, thunkApi) => {
  const { rejectWithValue, getState } = thunkApi

  try {
    const state = getState()

    const response = await apiClient(`/companies/${props.id}`, {
      method: "GET",
    })

    const data = response.data as ResponseData<ICompanyEntity | undefined>

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
