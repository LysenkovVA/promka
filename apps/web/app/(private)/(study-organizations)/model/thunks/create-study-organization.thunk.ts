"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { StudyOrganization } from "../types/study-organization.schema"

export interface CreateStudyOrganizationThunkProps {
  entityData: StudyOrganization
  workspaceId: string
}

export const createStudyOrganizationThunk = createAsyncThunk<
  ResponseData<StudyOrganization | undefined>,
  CreateStudyOrganizationThunkProps,
  ThunkConfig<string>
>("createStudyOrganizationThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(
      `/workspaces/${props.workspaceId}/study-organizations/create`,
      {
        method: "POST",
        data: formData,
      }
    )

    const createdEntity = response.data as ResponseData<
      StudyOrganization | undefined
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
