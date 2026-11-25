import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { TAKE } from "@/config/app"
import { getCitizenshipsThunk } from "../thunks/get-citizenships.thunk"
import { citizenshipAdapter } from "../adapter/citizenship.adapter"
import { updateCitizenshipThunk } from "../thunks/update-citizenship.thunk"
import { deleteCitizenshipThunk } from "../thunks/delete-citizenship.thunk"
import { Citizenship } from "../types/citizenship.schema"
import { CitizenshipFilters } from "../types/citizenship.filters"
import { changeActiveWorkspaceThunk, logoutThunk } from "@/app/(public)/(auth)"

const initialState: ListReduxSchema<Citizenship, CitizenshipFilters> = {
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

export const citizenshipsSlice = createSlice({
  name: "citizenshipsSlice",
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
      citizenshipAdapter.removeAll(state)
    },
    setFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<CitizenshipFilters, string[] | undefined> | undefined
      >
    ) => {
      state.filters = action.payload
      state.formDataFilters = action.payload
    },
    setFormDataFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<CitizenshipFilters, string[] | undefined> | undefined
      >
    ) => {
      state.formDataFilters = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Изменение workspaceId
      .addCase(changeActiveWorkspaceThunk.fulfilled, (state, action) => {
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
        citizenshipAdapter.removeAll(state)
      })
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
        citizenshipAdapter.removeAll(state)
      })
      .addCase(getCitizenshipsThunk.pending, (state, action) => {
        state.isLoading = true
        state.error = undefined

        if (action.meta.arg.replaceData) {
          state.take = TAKE
          state.skip = 0
          state.totalCount = 0
          state.hasMore = true
        }
      })
      .addCase(getCitizenshipsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = undefined

        // Если данные заменяются
        if (action.meta.arg.replaceData) {
          // Заменяем данные
          citizenshipAdapter.setAll(state, action.payload.data!)
        } else {
          // Добавляем порцию данных
          citizenshipAdapter.addMany(state, action.payload.data!)
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
      .addCase(getCitizenshipsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload

        state._isInitialized = true
      })
      // Обновление сотрудника
      .addCase(updateCitizenshipThunk.fulfilled, (state, action) => {
        citizenshipAdapter.upsertOne(state, action.payload.data!)
      })
      // Удаление
      .addCase(deleteCitizenshipThunk.fulfilled, (state, action) => {
        if (action.payload.data?.id) {
          citizenshipAdapter.removeOne(state, action.payload.data?.id)
        }
      })
  },
})

export const { actions: citizenshipsActions, reducer: citizenshipsReducer } =
  citizenshipsSlice
