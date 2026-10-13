"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { CertificateType } from "../types/certificate-type.schema"

export interface UpdateCertificateTypeThunkProps {
  entityData: CertificateType
  workspaceId: string
}

export const updateCertificateTypeThunk = createAsyncThunk<
  ResponseData<CertificateType | undefined>,
  UpdateCertificateTypeThunkProps,
  ThunkConfig<string>
>("updateCertificateTypeThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    console.log("Thunk", props.entityData)

    const response = await apiClient(
      `/workspaces/${props.workspaceId}/certificate-types/${props.entityData.id}`,
      {
        method: "PATCH",
        data: formData,
      }
    )

    const updatedEntity = response.data as ResponseData<
      CertificateType | undefined
    >

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
