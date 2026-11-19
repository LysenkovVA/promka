import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { TAKE } from "@/config/app"
import { getStudyOrganizationsThunk } from "../thunks/get-study-organizations.thunk"
import { studyOrganizationAdapter } from "../adapter/study-organization.adapter"
import { updateStudyOrganizationThunk } from "../thunks/update-study-organization.thunk"
import { deleteStudyOrganizationThunk } from "../thunks/delete-study-organization.thunk"
import { StudyOrganization } from "../types/study-organization.schema"
import { StudyOrganizationFilters } from "../types/study-organization.filters"
import { changeActiveWorkspaceThunk, logoutThunk } from "@/app/(public)/(auth)"

const initialState: ListReduxSchema<
  StudyOrganization,
  StudyOrganizationFilters
> = {
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

export const studyOrganizationsSlice = createSlice({
  name: "studyOrganizationsSlice",
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
      studyOrganizationAdapter.removeAll(state)
    },
    setFilters: (
      state,
      action: PayloadAction<
        | OptionalRecord<StudyOrganizationFilters, string[] | undefined>
        | undefined
      >
    ) => {
      state.filters = action.payload
      state.formDataFilters = action.payload
    },
    setFormDataFilters: (
      state,
      action: PayloadAction<
        | OptionalRecord<StudyOrganizationFilters, string[] | undefined>
        | undefined
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
        studyOrganizationAdapter.removeAll(state)
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
        studyOrganizationAdapter.removeAll(state)
      })
      .addCase(getStudyOrganizationsThunk.pending, (state, action) => {
        state.isLoading = true
        state.error = undefined

        if (action.meta.arg.replaceData) {
          state.take = TAKE
          state.skip = 0
          state.totalCount = 0
          state.hasMore = true
        }
      })
      .addCase(getStudyOrganizationsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = undefined

        // Если данные заменяются
        if (action.meta.arg.replaceData) {
          // Заменяем данные
          studyOrganizationAdapter.setAll(state, action.payload.data!)
        } else {
          // Добавляем порцию данных
          studyOrganizationAdapter.addMany(state, action.payload.data!)
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
      .addCase(getStudyOrganizationsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload

        state._isInitialized = true
      })
      // Обновление сотрудника
      .addCase(updateStudyOrganizationThunk.fulfilled, (state, action) => {
        studyOrganizationAdapter.upsertOne(state, action.payload.data!)
      })
      // Удаление
      .addCase(deleteStudyOrganizationThunk.fulfilled, (state, action) => {
        if (action.payload.data?.id) {
          studyOrganizationAdapter.removeOne(state, action.payload.data?.id)
        }
      })
  },
})

export const {
  actions: studyOrganizationsActions,
  reducer: studyOrganizationsReducer,
} = studyOrganizationsSlice
