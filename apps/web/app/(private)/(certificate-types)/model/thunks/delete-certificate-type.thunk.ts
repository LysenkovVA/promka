"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { CertificateType } from "../types/certificate-type.schema"

export interface DeleteCertificateTypeThunkProps {
  certificateTypeId: string
  workspaceId: string
}

export const deleteCertificateTypeThunk = createAsyncThunk<
  ResponseData<CertificateType | undefined>,
  DeleteCertificateTypeThunkProps,
  ThunkConfig<string>
>("deleteCertificateTypeThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient(
      `/workspaces/${props.workspaceId}/certificate-types/${props.certificateTypeId}`,
      {
        method: "DELETE",
      }
    )

    const deletedEntity = response.data as ResponseData<
      CertificateType | undefined
    >

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
