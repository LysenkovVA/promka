"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { CertificateType } from "../types/certificate-type.schema"

export interface CreateCertificateTypeThunkProps {
  entityData: CertificateType
  workspaceId: string
}

export const createCertificateTypeThunk = createAsyncThunk<
  ResponseData<CertificateType | undefined>,
  CreateCertificateTypeThunkProps,
  ThunkConfig<string>
>("createCertificateTypeThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(
      `/workspaces/${props.workspaceId}/certificate-types/create`,
      {
        method: "POST",
        data: formData,
      }
    )

    const createdEntity = response.data as ResponseData<
      CertificateType | undefined
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
