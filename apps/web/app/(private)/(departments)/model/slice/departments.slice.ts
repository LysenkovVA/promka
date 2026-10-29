import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { TAKE } from "@/config/app"
import { getDepartmentsThunk } from "../thunks/get-departments.thunk"
import { departmentAdapter } from "../adapter/department.adapter"
import { updateDepartmentThunk } from "../thunks/update-department.thunk"
import { deleteDepartmentThunk } from "../thunks/delete-department.thunk"
import { Department } from "../types/department.schema"
import { DepartmentFilters } from "../types/department.filters"
import { logoutThunk } from "@/app/(public)/(auth)/model/thunks/logoutThunk"
import { changeActiveWorkspaceThunk } from "@/app/(public)/(auth)/model/thunks/changeActiveWorkspaceThunk"

const initialState: ListReduxSchema<Department, DepartmentFilters> = {
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

export const departmentsSlice = createSlice({
  name: "departmentsSlice",
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
      departmentAdapter.removeAll(state)
    },
    setFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<DepartmentFilters, string[] | undefined> | undefined
      >
    ) => {
      state.filters = action.payload
      state.formDataFilters = action.payload
    },
    setFormDataFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<DepartmentFilters, string[] | undefined> | undefined
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
        departmentAdapter.removeAll(state)
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
        departmentAdapter.removeAll(state)
      })
      .addCase(getDepartmentsThunk.pending, (state, action) => {
        state.isLoading = true
        state.error = undefined

        if (action.meta.arg.replaceData) {
          state.take = TAKE
          state.skip = 0
          state.totalCount = 0
          state.hasMore = true
        }
      })
      .addCase(getDepartmentsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = undefined

        // Если данные заменяются
        if (action.meta.arg.replaceData) {
          // Заменяем данные
          departmentAdapter.setAll(state, action.payload.data!)
        } else {
          // Добавляем порцию данных
          departmentAdapter.addMany(state, action.payload.data!)
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
      .addCase(getDepartmentsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload

        state._isInitialized = true
      })
      // Обновление сотрудника
      .addCase(updateDepartmentThunk.fulfilled, (state, action) => {
        departmentAdapter.upsertOne(state, action.payload.data!)
      })
      // Удаление
      .addCase(deleteDepartmentThunk.fulfilled, (state, action) => {
        if (action.payload.data?.id) {
          departmentAdapter.removeOne(state, action.payload.data?.id)
        }
      })
  },
})

export const { actions: departmentsActions, reducer: departmentsReducer } =
  departmentsSlice
