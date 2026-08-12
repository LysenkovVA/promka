"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ThunkConfig } from "@/lib/redux"
import { ICompanyEntity } from "@/app/(private)/(companies)"
import { authActions } from "@/app/(auth)"
import { getEmployeesSimpleListThunk } from "@/app/(private)/(employees)/model/thunks/get-employees-simple-list-thunk"

export interface ChangeActiveCompanyThunkProps {
  company?: ICompanyEntity
}

export const changeActiveCompanyThunk = createAsyncThunk<
  void,
  ChangeActiveCompanyThunkProps,
  ThunkConfig<string>
>("changeActiveCompanyThunk", async (props, thunkApi) => {
  const { rejectWithValue, dispatch, getState } = thunkApi

  try {
    const state = getState()

    // Изменение выбранной компании
    if (state.authSchema.entityData) {
      dispatch(
        authActions.setData({
          ...state.authSchema.entityData,
          activeCompany: props.company,
        })
      )

      // Компания изменилась, загружаем новые списки
      // TODO Контроль за всеми связанными списками
      if (props.company?.workspace?.id) {
        // Обновление списка сотрудников
        dispatch(
          getEmployeesSimpleListThunk({
            replaceData: true,
            workspaceId: props.company.workspace.id,
          })
        )
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
