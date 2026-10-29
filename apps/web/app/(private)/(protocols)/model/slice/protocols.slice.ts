import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { TAKE } from "@/config/app"
import { getProtocolsThunk } from "../thunks/get-protocols.thunk"
import { protocolAdapter } from "../adapter/protocol.adapter"
import { updateProtocolThunk } from "../thunks/update-protocol.thunk"
import { deleteProtocolThunk } from "../thunks/delete-protocol.thunk"
import { Protocol } from "../types/protocol.schema"
import { ProtocolFilters } from "../types/protocol.filters"
import { createProtocolThunk } from "../thunks/create-protocol.thunk"
import {
  createCertificateThunk,
  deleteCertificateThunk,
  updateCertificateThunk,
} from "@/Certificates"
import { toast } from "sonner"
import {
  createEmployeeThunk,
  deleteEmployeeThunk,
  updateEmployeeThunk,
} from "@/Employees"
import { changeActiveWorkspaceThunk, logoutThunk } from "@/app/(public)/(auth)"

const initialState: ListReduxSchema<Protocol, ProtocolFilters> = {
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

export const protocolsSlice = createSlice({
  name: "protocolsSlice",
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
      protocolAdapter.removeAll(state)
    },
    setFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<ProtocolFilters, string[] | undefined> | undefined
      >
    ) => {
      state.filters = action.payload
      state.formDataFilters = action.payload
    },
    setFormDataFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<ProtocolFilters, string[] | undefined> | undefined
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
        protocolAdapter.removeAll(state)
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
        protocolAdapter.removeAll(state)
      })
      .addCase(getProtocolsThunk.pending, (state, action) => {
        state.isLoading = true
        state.error = undefined

        if (action.meta.arg.replaceData) {
          state.take = TAKE
          state.skip = 0
          state.totalCount = 0
          state.hasMore = true
        }
      })
      .addCase(getProtocolsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = undefined

        // Если данные заменяются
        if (action.meta.arg.replaceData) {
          // Заменяем данные
          protocolAdapter.setAll(state, action.payload.data!)
        } else {
          // Добавляем порцию данных
          protocolAdapter.addMany(state, action.payload.data!)
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
      .addCase(getProtocolsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload

        state._isInitialized = true
      })
      // Создание протокола
      .addCase(createProtocolThunk.fulfilled, (state, action) => {
        protocolAdapter.addOne(state, action.payload.data!)
        state.totalCount += 1
      })
      // Изменение протокола
      .addCase(updateProtocolThunk.fulfilled, (state, action) => {
        protocolAdapter.upsertOne(state, action.payload.data!)
      })
      // Удаление протокола
      .addCase(deleteProtocolThunk.fulfilled, (state, action) => {
        if (action.payload.data?.id) {
          protocolAdapter.removeOne(state, action.payload.data?.id)
          state.totalCount -= 1
        }
      })
      // Добавление удостоверения
      .addCase(createCertificateThunk.fulfilled, (state, action) => {
        toast.message("createCertificateThunk в protocolsSlice не реализован")
      })
      // Обновление удостоверения
      .addCase(updateCertificateThunk.fulfilled, (state, action) => {
        toast.message("updateCertificateThunk в protocolsSlice не реализован")
      })
      // Удаление удостоверения
      .addCase(deleteCertificateThunk.fulfilled, (state, action) => {
        toast.message("deleteCertificateThunk в protocolsSlice не реализован")
      })
      // Добавление сотрудника
      .addCase(createEmployeeThunk.fulfilled, (state, action) => {
        toast.message("createEmployeeThunk в protocolsSlice не реализован")
      })
      // Обновление протокола
      .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
        toast.message("updateEmployeeThunk в protocolsSlice не реализован")
      })
      // Удаление протокола
      .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
        toast.message("deleteEmployeeThunk в protocolsSlice не реализован")
      })
  },
})

export const { actions: protocolsActions, reducer: protocolsReducer } =
  protocolsSlice
