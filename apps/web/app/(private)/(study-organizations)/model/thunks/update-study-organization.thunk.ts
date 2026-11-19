"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { StudyOrganization } from "../types/study-organization.schema"

export interface UpdateStudyOrganizationThunkProps {
  entityData: StudyOrganization
  workspaceId: string
}

export const updateStudyOrganizationThunk = createAsyncThunk<
  ResponseData<StudyOrganization | undefined>,
  UpdateStudyOrganizationThunkProps,
  ThunkConfig<string>
>("updateStudyOrganizationThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(
      `/workspaces/${props.workspaceId}/study-organizations/${props.entityData.id}`,
      {
        method: "PATCH",
        data: formData,
      }
    )

    const updatedEntity = response.data as ResponseData<
      StudyOrganization | undefined
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
