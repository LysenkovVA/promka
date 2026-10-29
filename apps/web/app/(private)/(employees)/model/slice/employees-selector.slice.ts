import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { Employee } from "../types/employee.schema"
import { EmployeeFilters } from "../types/employee.filters"
import { TAKE } from "@/config/app"
import { employeeAdapter } from "../adapter/employee.adapter"
import { updateEmployeeThunk } from "../thunks/update-employee.thunk"
import { deleteEmployeeThunk } from "../thunks/delete-employee.thunk"
import { getEmployeesSelectorThunk } from "../thunks/get-employees-selector.thunk"
import { createEmployeeThunk } from "../thunks/create-employee.thunk"
import { changeActiveWorkspaceThunk, logoutThunk } from "@/app/(public)/(auth)"

const initialState: ListReduxSchema<Employee, EmployeeFilters> = {
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

export const employeesSelectorSlice = createSlice({
  name: "employeesSelectorSlice",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string | undefined>) => {
      state.search = action.payload
    },
    setFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<EmployeeFilters, string[] | undefined> | undefined
      >
    ) => {
      state.filters = action.payload
      state.formDataFilters = action.payload
    },
    setFormDataFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<EmployeeFilters, string[] | undefined> | undefined
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
        employeeAdapter.removeAll(state)
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
        employeeAdapter.removeAll(state)
      })
      .addCase(getEmployeesSelectorThunk.pending, (state, action) => {
        state.isLoading = true
        state.error = undefined

        if (action.meta.arg.replaceData) {
          state.take = TAKE
          state.skip = 0
          state.totalCount = 0
          state.hasMore = true
        }
      })
      .addCase(getEmployeesSelectorThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = undefined

        // Если данные заменяются
        if (action.meta.arg.replaceData) {
          // Заменяем данные
          employeeAdapter.setAll(state, action.payload.data!)
        } else {
          // Добавляем порцию данных
          employeeAdapter.addMany(state, action.payload.data!)
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
      .addCase(getEmployeesSelectorThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload

        state._isInitialized = true
      })
      // Добавление сотрудника
      .addCase(createEmployeeThunk.fulfilled, (state, action) => {
        employeeAdapter.addOne(state, action.payload.data!)
      })
      // Обновление сотрудника
      .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
        employeeAdapter.upsertOne(state, action.payload.data!)
      })
      // Удаление сотрудника
      .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
        if (action.payload.data?.id) {
          employeeAdapter.removeOne(state, action.payload.data?.id)
        }
      })
  },
})

export const {
  actions: employeesSelectorActions,
  reducer: employeesSelectorReducer,
} = employeesSelectorSlice
