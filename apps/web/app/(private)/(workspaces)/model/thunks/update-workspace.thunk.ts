"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { Workspace } from "../types/workspace.schema"

export interface UpdateWorkspaceThunkProps {
  entityData: Workspace
  workspaceId: string
}

export const updateWorkspaceThunk = createAsyncThunk<
  ResponseData<Workspace | undefined>,
  UpdateWorkspaceThunkProps,
  ThunkConfig<string>
>("updateWorkspaceThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(`/workspaces/${props.workspaceId}`, {
      method: "PATCH",
      data: formData,
    })

    const updatedEntity = response.data as ResponseData<Workspace | undefined>

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
