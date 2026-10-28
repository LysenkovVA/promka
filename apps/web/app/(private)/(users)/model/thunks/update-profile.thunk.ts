"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { User } from "@/Users/model/types/UserSchema"

export interface UpdateProfileThunkProps {
  entityData: User
}

export const updateProfileThunk = createAsyncThunk<
  ResponseData<User | undefined>,
  UpdateProfileThunkProps,
  ThunkConfig<string>
>("updateProfileThunk", async (props, thunkApi) => {
  const { rejectWithValue } = thunkApi

  try {
    const formData = new FormData()

    // Данные сущности
    formData.append("entity-data", JSON.stringify(props.entityData))

    const response = await apiClient(`/profile`, {
      method: "PATCH",
      data: formData,
    })

    const updatedEntity = response.data as ResponseData<User | undefined>

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
