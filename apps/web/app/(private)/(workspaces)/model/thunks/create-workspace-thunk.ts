"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { CreateWorkspaceResponse } from "../types/create-workspace-response.schema"
import { CreateWorkspaceRequest } from "../types/create-workspace-request.schema"

export interface CreateWorkspaceThunkProps {
  entityData: CreateWorkspaceRequest
}

export const createWorkspaceThunk = createAsyncThunk<
  ResponseData<CreateWorkspaceResponse | undefined>,
  CreateWorkspaceThunkProps,
  ThunkConfig<string>
>("createWorkspaceThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(`/workspaces`, {
      method: "POST",
      data: formData,
    })

    const createdEntity = response.data as ResponseData<
      CreateWorkspaceResponse | undefined
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
