import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { Employee } from "../types/employee.schema"
import { EmployeeFilters } from "../types/employee.filters"
import { TAKE } from "@/config/app"
import { getEmployeesThunk } from "../thunks/get-employees.thunk"
import { employeeAdapter } from "../adapter/employee.adapter"
import { updateEmployeeThunk } from "@/Employees/model/thunks/update-employee.thunk"

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

export const employeesSlice = createSlice({
  name: "employeesSlice",
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
      .addCase(getEmployeesThunk.pending, (state, action) => {
        state.isLoading = true
        state.error = undefined

        if (action.meta.arg.replaceData) {
          state.take = TAKE
          state.skip = 0
          state.totalCount = 0
          state.hasMore = true
        }
      })
      .addCase(getEmployeesThunk.fulfilled, (state, action) => {
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
      .addCase(getEmployeesThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload

        state._isInitialized = true
      })
      // Обновление работника
      .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
        employeeAdapter.upsertOne(state, action.payload.data!)
      })
  },
})

export const { actions: employeesActions, reducer: employeesReducer } =
  employeesSlice
