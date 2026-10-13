"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { CertificateType } from "../types/certificate-type.schema"

export interface GetCertificateTypeByIdThunkProps {
  certificateTypeId: string
}

export const getCertificateTypeByIdThunk = createAsyncThunk<
  ResponseData<CertificateType | undefined>,
  GetCertificateTypeByIdThunkProps,
  ThunkConfig<string>
>("getCertificateTypeByIdThunk", async (props, thunkApi) => {
  const { rejectWithValue, getState } = thunkApi

  try {
    // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
    // useSelector будет выдавать ошибку
    const state = getState()

    const activeWorkspaceId = state.authSchema?.entityData?.activeWorkspaceId

    if (!activeWorkspaceId) {
      rejectWithValue("No active workspace id found")
    }

    // Отправляем запрос
    const response = await apiClient(
      `/workspaces/${activeWorkspaceId}/certificate-types/${props.certificateTypeId}`,
      {
        method: "GET",
      }
    )

    const data = response.data as ResponseData<CertificateType | undefined>

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
