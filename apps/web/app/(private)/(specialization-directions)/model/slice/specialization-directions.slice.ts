import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { TAKE } from "@/config/app"
import { getSpecializationDirectionsThunk } from "../thunks/get-specialization-directions.thunk"
import { specializationDirectionAdapter } from "../adapter/specialization-direction.adapter"
import { updateSpecializationDirectionThunk } from "../thunks/update-specialization-direction.thunk"
import { deleteSpecializationDirectionThunk } from "../thunks/delete-specialization-direction.thunk"
import { SpecializationDirection } from "../types/specialization-direction.schema"
import { SpecializationDirectionsFilters } from "../types/specialization-direction.filters"
import { changeActiveWorkspaceThunk, logoutThunk } from "@/app/(public)/(auth)"

const initialState: ListReduxSchema<
  SpecializationDirection,
  SpecializationDirectionsFilters
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

export const specializationDirectionDirectionsSlice = createSlice({
  name: "specializationDirectionsSlice",
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
      specializationDirectionAdapter.removeAll(state)
    },
    setFilters: (
      state,
      action: PayloadAction<
        | OptionalRecord<SpecializationDirectionsFilters, string[] | undefined>
        | undefined
      >
    ) => {
      state.filters = action.payload
      state.formDataFilters = action.payload
    },
    setFormDataFilters: (
      state,
      action: PayloadAction<
        | OptionalRecord<SpecializationDirectionsFilters, string[] | undefined>
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
        specializationDirectionAdapter.removeAll(state)
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
        specializationDirectionAdapter.removeAll(state)
      })
      .addCase(getSpecializationDirectionsThunk.pending, (state, action) => {
        state.isLoading = true
        state.error = undefined

        if (action.meta.arg.replaceData) {
          state.take = TAKE
          state.skip = 0
          state.totalCount = 0
          state.hasMore = true
        }
      })
      .addCase(getSpecializationDirectionsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = undefined

        // Если данные заменяются
        if (action.meta.arg.replaceData) {
          // Заменяем данные
          specializationDirectionAdapter.setAll(state, action.payload.data!)
        } else {
          // Добавляем порцию данных
          specializationDirectionAdapter.addMany(state, action.payload.data!)
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
      .addCase(getSpecializationDirectionsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload

        state._isInitialized = true
      })
      // Обновление сотрудника
      .addCase(
        updateSpecializationDirectionThunk.fulfilled,
        (state, action) => {
          specializationDirectionAdapter.upsertOne(state, action.payload.data!)
        }
      )
      // Удаление
      .addCase(
        deleteSpecializationDirectionThunk.fulfilled,
        (state, action) => {
          if (action.payload.data?.id) {
            specializationDirectionAdapter.removeOne(
              state,
              action.payload.data?.id
            )
          }
        }
      )
  },
})

export const {
  actions: specializationDirectionsActions,
  reducer: specializationDirectionsReducer,
} = specializationDirectionDirectionsSlice
