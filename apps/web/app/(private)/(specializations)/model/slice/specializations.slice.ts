import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { TAKE } from "@/config/app"
import { getSpecializationsThunk } from "../thunks/get-specializations.thunk"
import { specializationAdapter } from "../adapter/specialization.adapter"
import { updateSpecializationThunk } from "../thunks/update-specialization.thunk"
import { deleteSpecializationThunk } from "../thunks/delete-specialization.thunk"
import { Specialization } from "../types/specialization.schema"
import { SpecializationsFilters } from "../types/specialization.filters"
import { changeActiveWorkspaceThunk, logoutThunk } from "@/app/(public)/(auth)"

const initialState: ListReduxSchema<Specialization, SpecializationsFilters> = {
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

export const specializationsSlice = createSlice({
  name: "specializationsSlice",
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
      specializationAdapter.removeAll(state)
    },
    setFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<SpecializationsFilters, string[] | undefined> | undefined
      >
    ) => {
      state.filters = action.payload
      state.formDataFilters = action.payload
    },
    setFormDataFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<SpecializationsFilters, string[] | undefined> | undefined
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
        specializationAdapter.removeAll(state)
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
        specializationAdapter.removeAll(state)
      })
      .addCase(getSpecializationsThunk.pending, (state, action) => {
        state.isLoading = true
        state.error = undefined

        if (action.meta.arg.replaceData) {
          state.take = TAKE
          state.skip = 0
          state.totalCount = 0
          state.hasMore = true
        }
      })
      .addCase(getSpecializationsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = undefined

        // Если данные заменяются
        if (action.meta.arg.replaceData) {
          // Заменяем данные
          specializationAdapter.setAll(state, action.payload.data!)
        } else {
          // Добавляем порцию данных
          specializationAdapter.addMany(state, action.payload.data!)
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
      .addCase(getSpecializationsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload

        state._isInitialized = true
      })
      // Обновление сотрудника
      .addCase(updateSpecializationThunk.fulfilled, (state, action) => {
        specializationAdapter.upsertOne(state, action.payload.data!)
      })
      // Удаление
      .addCase(deleteSpecializationThunk.fulfilled, (state, action) => {
        if (action.payload.data?.id) {
          specializationAdapter.removeOne(state, action.payload.data?.id)
        }
      })
  },
})

export const {
  actions: specializationsActions,
  reducer: specializationsReducer,
} = specializationsSlice
