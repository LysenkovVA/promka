import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { TAKE } from "@/config/app"
import { getSpecializationParametersThunk } from "../thunks/get-specialization-parameters.thunk"
import { specializationParameterAdapter } from "../adapter/specialization-parameter.adapter"
import { updateSpecializationParameterThunk } from "../thunks/update-specialization-parameter.thunk"
import { deleteSpecializationParameterThunk } from "../thunks/delete-specialization-parameter.thunk"
import { SpecializationParameter } from "../types/specialization-parameter.schema"
import { SpecializationParametersFilters } from "../types/specialization-parameter.filters"
import { changeActiveWorkspaceThunk, logoutThunk } from "@/app/(public)/(auth)"

const initialState: ListReduxSchema<
  SpecializationParameter,
  SpecializationParametersFilters
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

export const specializationParameterParametersSlice = createSlice({
  name: "specializationParametersSlice",
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
      specializationParameterAdapter.removeAll(state)
    },
    setFilters: (
      state,
      action: PayloadAction<
        | OptionalRecord<SpecializationParametersFilters, string[] | undefined>
        | undefined
      >
    ) => {
      state.filters = action.payload
      state.formDataFilters = action.payload
    },
    setFormDataFilters: (
      state,
      action: PayloadAction<
        | OptionalRecord<SpecializationParametersFilters, string[] | undefined>
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
        specializationParameterAdapter.removeAll(state)
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
        specializationParameterAdapter.removeAll(state)
      })
      .addCase(getSpecializationParametersThunk.pending, (state, action) => {
        state.isLoading = true
        state.error = undefined

        if (action.meta.arg.replaceData) {
          state.take = TAKE
          state.skip = 0
          state.totalCount = 0
          state.hasMore = true
        }
      })
      .addCase(getSpecializationParametersThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = undefined

        // Если данные заменяются
        if (action.meta.arg.replaceData) {
          // Заменяем данные
          specializationParameterAdapter.setAll(state, action.payload.data!)
        } else {
          // Добавляем порцию данных
          specializationParameterAdapter.addMany(state, action.payload.data!)
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
      .addCase(getSpecializationParametersThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload

        state._isInitialized = true
      })
      // Обновление сотрудника
      .addCase(
        updateSpecializationParameterThunk.fulfilled,
        (state, action) => {
          specializationParameterAdapter.upsertOne(state, action.payload.data!)
        }
      )
      // Удаление
      .addCase(
        deleteSpecializationParameterThunk.fulfilled,
        (state, action) => {
          if (action.payload.data?.id) {
            specializationParameterAdapter.removeOne(
              state,
              action.payload.data?.id
            )
          }
        }
      )
  },
})

export const {
  actions: specializationParametersActions,
  reducer: specializationParametersReducer,
} = specializationParameterParametersSlice
