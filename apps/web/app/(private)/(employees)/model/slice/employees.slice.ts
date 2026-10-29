import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { Employee } from "../types/employee.schema"
import { EmployeeFilters } from "../types/employee.filters"
import { TAKE } from "@/config/app"
import { getEmployeesThunk } from "../thunks/get-employees.thunk"
import { employeeAdapter } from "../adapter/employee.adapter"
import { updateEmployeeThunk } from "../thunks/update-employee.thunk"
import { deleteEmployeeThunk } from "../thunks/delete-employee.thunk"
import { createEmployeeThunk } from "@/Employees/model/thunks/create-employee.thunk"
import { createCertificateThunk } from "@/Certificates/model/thunks/create-certificate.thunk"
import { toast } from "sonner"
import { updateCertificateThunk } from "@/Certificates/model/thunks/update-certificate.thunk"
import { deleteCertificateThunk } from "@/Certificates/model/thunks/delete-certificate.thunk"
import { createProtocolThunk } from "@/Protocols"
import { updateProtocolThunk } from "@/Protocols/model/thunks/update-protocol.thunk"
import { deleteProtocolThunk } from "@/Protocols/model/thunks/delete-protocol.thunk"
import { logoutThunk } from "@/app/(public)/(auth)/model/thunks/logoutThunk"
import { changeActiveWorkspaceThunk } from "@/app/(public)/(auth)/model/thunks/changeActiveWorkspaceThunk"

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
      // Добавление удостоверения
      .addCase(createCertificateThunk.fulfilled, (state, action) => {
        toast.message("createCertificateThunk в employeesSlice не реализован")
      })
      // Обновление удостоверения
      .addCase(updateCertificateThunk.fulfilled, (state, action) => {
        toast.message("updateCertificateThunk в employeesSlice не реализован")
      })
      // Удаление удостоверения
      .addCase(deleteCertificateThunk.fulfilled, (state, action) => {
        toast.message("deleteCertificateThunk в employeesSlice не реализован")
      })
      // Добавление протокола
      .addCase(createProtocolThunk.fulfilled, (state, action) => {
        toast.message("createProtocolThunk в employeesSlice не реализован")
      })
      // Обновление протокола
      .addCase(updateProtocolThunk.fulfilled, (state, action) => {
        toast.message("updateProtocolThunk в employeesSlice не реализован")
      })
      // Удаление протокола
      .addCase(deleteProtocolThunk.fulfilled, (state, action) => {
        toast.message("deleteProtocolThunk в employeesSlice не реализован")
      })
  },
})

export const { actions: employeesActions, reducer: employeesReducer } =
  employeesSlice
