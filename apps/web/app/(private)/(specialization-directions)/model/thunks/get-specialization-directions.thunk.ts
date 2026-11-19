"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import { TAKE } from "@/config/app"
import { QueryParamsGenerator } from "@/lib/url/searchParams"
import apiClient from "@/lib/axios/apiClient"
import { SpecializationDirection } from "../types/specialization-direction.schema"

export interface GetSpecializationDirectionsThunkProps {
  replaceData?: boolean
}

export const getSpecializationDirectionsThunk = createAsyncThunk<
  ResponseData<SpecializationDirection[] | undefined>,
  GetSpecializationDirectionsThunkProps,
  ThunkConfig<string>
>("getSpecializationDirectionsThunk", async (props, thunkApi) => {
  const { rejectWithValue, getState } = thunkApi

  try {
    // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
    // useSelector будет выдавать ошибку
    const state = getState()

    const activeWorkspaceId = state.authSchema?.entityData?.activeWorkspaceId

    if (!activeWorkspaceId) {
      rejectWithValue("No active workspace id found")
    }

    const take = state.specializationDirectionsSchema?.take ?? TAKE
    const skip = state.specializationDirectionsSchema?.skip ?? 0
    const search = state.specializationDirectionsSchema?.search
    // TODO
    //const filters = state.certificatesSchema?.filters

    const queryDirections = new QueryParamsGenerator()
      .setOne("search", search)
      .setOne("skip", skip?.toString())
      .setOne("take", take?.toString())

    // Отправляем запрос
    const response = await apiClient(
      `/workspaces/${activeWorkspaceId}/specialization-directions${queryDirections.toString()}`,
      {
        method: "GET",
      }
    )

    const data = response.data as ResponseData<
      SpecializationDirection[] | undefined
    >

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
