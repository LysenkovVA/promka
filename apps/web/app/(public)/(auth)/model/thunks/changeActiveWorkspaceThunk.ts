"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import { authActions } from "@/app/(public)/(auth)"

export interface ChangeActiveWorkspaceThunkProps {
  workspaceId?: string
}

export const changeActiveWorkspaceThunk = createAsyncThunk<
  void,
  ChangeActiveWorkspaceThunkProps,
  ThunkConfig<string>
>("changeActiveWorkspaceThunk", async (props, thunkApi) => {
  const { rejectWithValue, dispatch, getState } = thunkApi

  try {
    const state = getState()

    // Изменение выбранной компании
    if (state.authSchema.entityData) {
      dispatch(
        authActions.setData({
          ...state.authSchema.entityData,
          activeWorkspaceId: props.workspaceId,
        })
      )

      // Компания изменилась, загружаем новые списки
      // TODO Контроль за всеми связанными списками
      if (props.workspaceId) {
        // dispatch(getCompanyByIdThunk({ id: props.company.id! }))
        // Обновление списка сотрудников
        // TODO
        // dispatch(
        //   getEmployeesSimpleListThunk({
        //     replaceData: true,
        //     workspaceId: props.workspaceId,
        //   })
        // )
      } else {
        return rejectWithValue(
          ResponseData.InternalServerError(
            new Error(
              "Не удалось получить workspaceId в changeActiveCompanyThunk"
            )
          ).getAllErrors()
        )
      }
    }
  } catch (error: any) {
    // Сетевая ошибка или другая проблема
    return rejectWithValue(
      ResponseData.InternalServerError(error).getAllErrors()
    )
  }
})
