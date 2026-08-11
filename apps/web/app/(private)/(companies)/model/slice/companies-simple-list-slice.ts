import { createSlice } from "@reduxjs/toolkit"
import { SimpleListReduxSchema } from "@/lib/redux/model/types/SimpleListReduxSchema"
import { ICompanyEntity } from "../types/ICompanyEntity"
import { getCompaniesSimpleListThunk } from "@/app/(private)/(companies)/model/thunks/get-companies-simple-list-thunk"
import { companyAdapter } from "@/app/(private)/(companies)/model/adapter/companyAdapter"
import { upsertCompanyThunk } from "@/app/(private)/(companies)/model/thunks/upsert-company-thunk"

const initialState: SimpleListReduxSchema<ICompanyEntity> = {
  ids: [],
  entities: {},
  error: undefined,
  isFetching: false,
  _isInitialized: false,
}

export const companiesSimpleListSlice = createSlice({
  name: "companiesSimpleListSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getCompaniesSimpleListThunk.pending,
        (state: SimpleListReduxSchema<ICompanyEntity>) => {
          state.ids = []
          state.entities = {}
          state.isFetching = true
          state.error = ""
          state._isInitialized = false
        }
      )
      .addCase(
        getCompaniesSimpleListThunk.fulfilled,
        (state: SimpleListReduxSchema<ICompanyEntity>, action) => {
          state.isFetching = false
          state.error = undefined

          // Если данные заменяются
          if (action.meta.arg.replaceData) {
            // Заменяем данные
            companyAdapter.setAll(state, action.payload.data!)
          } else {
            // Добавляем порцию данных
            companyAdapter.addMany(state, action.payload.data!)
          }

          state._isInitialized = true
        }
      )
      .addCase(
        getCompaniesSimpleListThunk.rejected,
        (state: SimpleListReduxSchema<ICompanyEntity>, action) => {
          state.isFetching = false
          state.error = action.payload
          state._isInitialized = true
        }
      )
      .addCase(
        upsertCompanyThunk.fulfilled,
        (state: SimpleListReduxSchema<ICompanyEntity>, action) => {
          if (action.payload.data)
            companyAdapter.upsertOne(state, action.payload.data)
        }
      )
  },
})

export const { actions: companiesSimpleListActions } = companiesSimpleListSlice
export const { reducer: companiesSimpleListReducer } = companiesSimpleListSlice
