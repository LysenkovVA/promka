"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { Certificate } from "../types/certificate.schema"

export interface CreateCertificateThunkProps {
  entityData: Certificate
  workspaceId: string
}

export const createCertificateThunk = createAsyncThunk<
  ResponseData<Certificate | undefined>,
  CreateCertificateThunkProps,
  ThunkConfig<string>
>("createCertificateThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(
      `/workspaces/${props.workspaceId}/certificates/create`,
      {
        method: "POST",
        data: formData,
      }
    )

    const createdEntity = response.data as ResponseData<Certificate | undefined>

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
