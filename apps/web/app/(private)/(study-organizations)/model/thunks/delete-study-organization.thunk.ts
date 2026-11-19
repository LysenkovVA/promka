"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { StudyOrganization } from "../types/study-organization.schema"

export interface DeleteStudyOrganizationThunkProps {
  studyOrganizationId: string
  workspaceId: string
}

export const deleteStudyOrganizationThunk = createAsyncThunk<
  ResponseData<StudyOrganization | undefined>,
  DeleteStudyOrganizationThunkProps,
  ThunkConfig<string>
>("deleteStudyOrganizationThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const response = await apiClient(
      `/workspaces/${props.workspaceId}/study-organizations/${props.studyOrganizationId}`,
      {
        method: "DELETE",
      }
    )

    const deletedEntity = response.data as ResponseData<
      StudyOrganization | undefined
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
