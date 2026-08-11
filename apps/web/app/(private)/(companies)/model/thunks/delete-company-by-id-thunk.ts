"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ICompanyEntity } from "@/app/(private)/(companies)"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"

export interface DeleteCompanyByIdThunkProps {
  id: string
}

export const deleteCompanyByIdThunk = createAsyncThunk<
  ResponseData<ICompanyEntity | undefined>,
  DeleteCompanyByIdThunkProps,
  ThunkConfig<string>
>("deleteCompanyByIdThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient(`/companies/${props.id}`, {
      method: "DELETE",
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
