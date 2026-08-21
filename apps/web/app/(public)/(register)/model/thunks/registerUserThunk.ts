"use client"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import apiClient from "@/lib/axios/apiClient"
import { RegisterUserRequest } from "@/Users/model/types/RegisterUserRequestSchema"
import { RegisterUserResponse } from "@/Users/model/types/RegisterUserResponseSchema"

export interface RegisterUserThunkProps {
  entityData: RegisterUserRequest
}

export const registerUserThunk = createAsyncThunk<
  ResponseData<RegisterUserResponse | undefined>,
  RegisterUserThunkProps,
  ThunkConfig<string>
>("registerUserThunk", async (props, thunkApi) => {
  const { rejectWithValue, dispatch } = thunkApi

  // let upsertedPhoto: FileEntity | undefined = undefined;

  try {
    // // Фотография
    // if (!props.entityData.avatar?.id && props.entityData.avatar?.fileUrl) {
    //     const photo = await dispatch(
    //         upsertFileThunk({
    //             entityData: props.entityData.avatar,
    //             bucketName: "avatars",
    //         }),
    //     ).unwrap();
    //
    //     if (photo.isOk) {
    //         upsertedPhoto = photo.data;
    //     }
    // }

    const formData = new FormData()

    // Данные сущности
    formData.append(
      "entity-data",
      JSON.stringify({
        ...props.entityData,
        // avatar:
        //     upsertedPhoto !== undefined
        //         ? { ...upsertedPhoto }
        //         : props.entityData.avatar,
      })
    )

    // console.log(
    //     "Upserting user: ",
    //     JSON.stringify(props.entityData, null, 2),
    // );

    const response = await apiClient(`/register`, {
      method: "POST",
      data: formData,
    })

    const createdEntity = response.data as ResponseData<
      RegisterUserResponse | undefined
    >

    // if (!createdEntity.isOk) {
    //     // Удаление загруженного фото в случае ошибки
    //     try {
    //         if (upsertedPhoto !== undefined && upsertedPhoto?.id) {
    //             await dispatch(
    //                 deleteFileByIdThunk({ id: upsertedPhoto.id }),
    //             );
    //         }
    //     } catch {}
    //
    //     return rejectWithValue(ResponseData.getAllErrors(createdEntity));
    // }

    if (!createdEntity.isOk) {
      return rejectWithValue(ResponseData.getAllErrors(createdEntity))
    }

    return createdEntity
  } catch (error) {
    // // Удаление загруженного фото в случае ошибки
    // try {
    //     if (upsertedPhoto !== undefined && upsertedPhoto?.id) {
    //         await dispatch(deleteFileByIdThunk({ id: upsertedPhoto.id }));
    //     }
    // } catch {}
    // Неизвестная ошибка в thunk-е
    return rejectWithValue(
      ResponseData.InternalServerError(error).getAllErrors()
    )
  }
})
