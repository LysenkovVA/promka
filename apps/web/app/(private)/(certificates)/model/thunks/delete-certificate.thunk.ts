"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { Certificate } from "../types/certificate.schema"

export interface DeleteCertificateThunkProps {
  certificateId: string
  workspaceId: string
}

export const deleteCertificateThunk = createAsyncThunk<
  ResponseData<Certificate | undefined>,
  DeleteCertificateThunkProps,
  ThunkConfig<string>
>("deleteCertificateThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient(
      `/workspaces/${props.workspaceId}/certificates/${props.certificateId}`,
      {
        method: "DELETE",
      }
    )

    const deletedEntity = response.data as ResponseData<Certificate | undefined>

    if (!deletedEntity.isOk) {
      return rejectWithValue(ResponseData.getAllErrors(deletedEntity))
    }

    return deletedEntity
  } catch (error) {
    return rejectWithValue(
      ResponseData.InternalServerError(error).getAllErrors()
    )
  }
})
