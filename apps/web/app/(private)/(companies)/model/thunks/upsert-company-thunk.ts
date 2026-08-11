"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ICompanyEntity } from "@/app/(private)/(companies)"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"

export interface UpsertCompanyThunkProps {
  entityData: ICompanyEntity
}

export const upsertCompanyThunk = createAsyncThunk<
  ResponseData<ICompanyEntity | undefined>,
  UpsertCompanyThunkProps,
  ThunkConfig<string>
>("upsertCompanyThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(`/companies/upsert`, {
      method: "POST",
      data: formData,
    })

    const createdEntity = response.data as ResponseData<
      ICompanyEntity | undefined
    >

    if (!createdEntity.isOk) {
      return rejectWithValue(ResponseData.getAllErrors(createdEntity))
    }

    return createdEntity
  } catch (error) {
    return rejectWithValue(
      ResponseData.InternalServerError(error).getAllErrors()
    )
  }
})
