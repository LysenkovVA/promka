import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { TAKE } from "@/config/app"
import { getCertificateTypesThunk } from "../thunks/get-certificate-types.thunk"
import { certificateTypeAdapter } from "../adapter/certificate-type.adapter"
import { updateCertificateTypeThunk } from "../thunks/update-certificate-type.thunk"
import { deleteCertificateTypeThunk } from "../thunks/delete-certificate-type.thunk"
import { CertificateType } from "../types/certificate-type.schema"
import { CertificateTypesFilters } from "../types/certificate-type.filters"
import { logoutThunk } from "@/app/(public)/(auth)/model/thunks/logoutThunk"

const initialState: ListReduxSchema<CertificateType, CertificateTypesFilters> =
  {
    ids: [],
    entities: {},
    isLoading: false,
    error: undefined,
    take: TAKE,
    skip: 0,
    search: "",
    filters: undefined,
    formDataFilters: undefined,
    totalCount: 0,
    hasMore: true,
    _isInitialized: false,
  }

export const certificateTypesSlice = createSlice({
  name: "certificateTypesSlice",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string | undefined>) => {
      state.search = action.payload
      state.take = TAKE
      state.skip = 0
    },
    clearData: (state) => {
      state.search = ""
      state.take = TAKE
      state.skip = 0
      certificateTypeAdapter.removeAll(state)
    },
    setFilters: (
      state,
      action: PayloadAction<
        | OptionalRecord<CertificateTypesFilters, string[] | undefined>
        | undefined
      >
    ) => {
      state.filters = action.payload
      state.formDataFilters = action.payload
    },
    setFormDataFilters: (
      state,
      action: PayloadAction<
        | OptionalRecord<CertificateTypesFilters, string[] | undefined>
        | undefined
      >
    ) => {
      state.formDataFilters = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Logout
      .addCase(logoutThunk.fulfilled, (state, action) => {
        // Очистка стейта
        state.isLoading = false
        state.error = undefined
        state.take = TAKE
        state.skip = 0
        state.search = undefined
        state.filters = undefined
        state.formDataFilters = undefined
        state.totalCount = 0
        state.hasMore = false
        state._isInitialized = false
        certificateTypeAdapter.removeAll(state)
      })
      .addCase(getCertificateTypesThunk.pending, (state, action) => {
        state.isLoading = true
        state.error = undefined

        if (action.meta.arg.replaceData) {
          state.take = TAKE
          state.skip = 0
          state.totalCount = 0
          state.hasMore = true
        }
      })
      .addCase(getCertificateTypesThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = undefined

        // Если данные заменяются
        if (action.meta.arg.replaceData) {
          // Заменяем данные
          certificateTypeAdapter.setAll(state, action.payload.data!)
        } else {
          // Добавляем порцию данных
          certificateTypeAdapter.addMany(state, action.payload.data!)
        }

        state.totalCount = action.payload.pagination?.total ?? 0
        state.hasMore = state.totalCount > state.skip + state.take

        // Увеличиваем счетчик следующих записей
        if (state.hasMore) {
          state.skip = state.skip + state.take
        } else {
          state.skip = state.totalCount
        }

        state._isInitialized = true
      })
      .addCase(getCertificateTypesThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload

        state._isInitialized = true
      })
      // Обновление сотрудника
      .addCase(updateCertificateTypeThunk.fulfilled, (state, action) => {
        certificateTypeAdapter.upsertOne(state, action.payload.data!)
      })
      // Удаление
      .addCase(deleteCertificateTypeThunk.fulfilled, (state, action) => {
        if (action.payload.data?.id) {
          certificateTypeAdapter.removeOne(state, action.payload.data?.id)
        }
      })
  },
})

export const {
  actions: certificateTypesActions,
  reducer: certificateTypesReducer,
} = certificateTypesSlice
