import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { TAKE } from "@/config/app"
import { getStudiesThunk } from "../thunks/get-studies.thunk"
import { studyAdapter } from "../adapter/study.adapter"
import { updateProtocolThunk } from "@/Protocols/model/thunks/update-protocol.thunk"
import { deleteProtocolThunk } from "@/Protocols/model/thunks/delete-protocol.thunk"
import { Study } from "../types/study.schema"
import { StudyFilters } from "../types/study.filters"
import { changeActiveWorkspaceThunk, logoutThunk } from "@/app/(public)/(auth)"
import { createProtocolThunk } from "@/Protocols/model/thunks/create-protocol.thunk"

const initialState: ListReduxSchema<Study, StudyFilters> = {
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

export const studiesSlice = createSlice({
  name: "studiesSlice",
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
      studyAdapter.removeAll(state)
    },
    setFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<StudyFilters, string[] | undefined> | undefined
      >
    ) => {
      state.filters = action.payload
      state.formDataFilters = action.payload
    },
    setFormDataFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<StudyFilters, string[] | undefined> | undefined
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
        studyAdapter.removeAll(state)
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
        studyAdapter.removeAll(state)
      })
      .addCase(getStudiesThunk.pending, (state, action) => {
        state.isLoading = true
        state.error = undefined

        if (action.meta.arg.replaceData) {
          state.take = TAKE
          state.skip = 0
          state.totalCount = 0
          state.hasMore = true
        }
      })
      .addCase(getStudiesThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = undefined

        // Если данные заменяются
        if (action.meta.arg.replaceData) {
          // Заменяем данные
          studyAdapter.setAll(state, action.payload.data!)
        } else {
          // Добавляем порцию данных
          studyAdapter.addMany(state, action.payload.data!)
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
      .addCase(getStudiesThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload

        state._isInitialized = true
      })
      // Создание
      .addCase(createProtocolThunk.fulfilled, (state, action) => {
        if (
          action.payload.data?.studies &&
          action.payload.data?.studies.length > 0
        ) {
          studyAdapter.addMany(state, action.payload.data.studies)
        }
      })
      // Обновление
      .addCase(updateProtocolThunk.fulfilled, (state, action) => {
        studyAdapter.upsertOne(state, action.payload.data!)
      })
      // Удаление
      .addCase(deleteProtocolThunk.fulfilled, (state, action) => {
        if (action.payload.data?.id) {
          studyAdapter.removeOne(state, action.payload.data?.id)
        }
      })
  },
})

export const { actions: studiesActions, reducer: studiesReducer } = studiesSlice
