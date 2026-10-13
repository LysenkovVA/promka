"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { Certificate } from "../types/certificate.schema"

export interface UpdateCertificateThunkProps {
  entityData: Certificate
  workspaceId: string
}

export const updateCertificateThunk = createAsyncThunk<
  ResponseData<Certificate | undefined>,
  UpdateCertificateThunkProps,
  ThunkConfig<string>
>("updateCertificateThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(
      `/workspaces/${props.workspaceId}/certificates/${props.entityData.id}`,
      {
        method: "PATCH",
        data: formData,
      }
    )

    const updatedEntity = response.data as ResponseData<Certificate | undefined>

    if (!updatedEntity.isOk) {
      return rejectWithValue(ResponseData.getAllErrors(updatedEntity))
    }

    return updatedEntity
  } catch (error) {
    return rejectWithValue(
      ResponseData.InternalServerError(error).getAllErrors()
    )
  }
})
