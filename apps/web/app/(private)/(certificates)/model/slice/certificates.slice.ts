import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { TAKE } from "@/config/app"
import { getCertificatesThunk } from "../thunks/get-certificates.thunk"
import { certificateAdapter } from "../adapter/certificate.adapter"
import { updateCertificateThunk } from "../thunks/update-certificate.thunk"
import { deleteCertificateThunk } from "../thunks/delete-certificate.thunk"
import { Certificate } from "../types/certificate.schema"
import { CertificateFilters } from "../types/certificate.filters"
import { createCertificateThunk } from "../thunks/create-certificate.thunk"
import {
  createProtocolThunk,
  deleteProtocolThunk,
  updateProtocolThunk,
} from "@/Protocols"
import {
  createEmployeeThunk,
  deleteEmployeeThunk,
  updateEmployeeThunk,
} from "@/Employees"
import { changeActiveWorkspaceThunk, logoutThunk } from "@/app/(public)/(auth)"

const initialState: ListReduxSchema<Certificate, CertificateFilters> = {
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

export const certificatesSlice = createSlice({
  name: "certificatesSlice",
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
      certificateAdapter.removeAll(state)
    },
    setFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<CertificateFilters, string[] | undefined> | undefined
      >
    ) => {
      state.filters = action.payload
      state.formDataFilters = action.payload
    },
    setFormDataFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<CertificateFilters, string[] | undefined> | undefined
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
        certificateAdapter.removeAll(state)
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
        certificateAdapter.removeAll(state)
      })
      .addCase(getCertificatesThunk.pending, (state, action) => {
        state.isLoading = true
        state.error = undefined

        if (action.meta.arg.replaceData) {
          state.take = TAKE
          state.skip = 0
          state.totalCount = 0
          state.hasMore = true
        }
      })
      .addCase(getCertificatesThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = undefined

        // Если данные заменяются
        if (action.meta.arg.replaceData) {
          // Заменяем данные
          certificateAdapter.setAll(state, action.payload.data!)
        } else {
          // Добавляем порцию данных
          certificateAdapter.addMany(state, action.payload.data!)
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
      .addCase(getCertificatesThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload

        state._isInitialized = true
      })
      // Создание удостоверения
      .addCase(createCertificateThunk.fulfilled, (state, action) => {
        certificateAdapter.addOne(state, action.payload.data!)
      })
      // Обновление удостоверения
      .addCase(updateCertificateThunk.fulfilled, (state, action) => {
        certificateAdapter.upsertOne(state, action.payload.data!)
      })
      // Удаление удостоверения
      .addCase(deleteCertificateThunk.fulfilled, (state, action) => {
        if (action.payload.data?.id) {
          certificateAdapter.removeOne(state, action.payload.data?.id)
        }
      })
      // Создание протокола
      .addCase(createProtocolThunk.fulfilled, (state, action) => {
        if (
          action.payload.data?.certificates &&
          action.payload.data?.certificates.length > 0
        ) {
          certificateAdapter.addMany(state, action.payload.data.certificates)
        }
      })
      // Обновление протокола
      .addCase(updateProtocolThunk.fulfilled, (state, action) => {
        const protocol = action.payload.data!
        const protocolId = protocol.id!
        const newCertificateIds = new Set(
          protocol.certificates?.map((cert) => cert.id).filter((id) => id)
        )

        // Удаляем удостоверения у которых нужный protocolId, но которых нет в новом списке
        const allEntityIds = Object.keys(state.entities)
        const certificatesToRemove = allEntityIds.filter(
          (id) =>
            state.entities[id]?.protocol?.id === protocolId &&
            !newCertificateIds.has(id)
        )

        certificatesToRemove.forEach((id) => {
          certificateAdapter.removeOne(state, id)
        })

        // Добавляем удостоверения с новым protocolId
        if (protocol.certificates && protocol.certificates.length > 0) {
          certificateAdapter.upsertMany(state, protocol.certificates)
        }
      })
      // Удаление протокола
      // TODO Сделать очистку протокола без удаления
      .addCase(deleteProtocolThunk.fulfilled, (state, action) => {
        const protocol = action.payload.data!
        const protocolId = protocol.id!
        const newCertificateIds = new Set(
          protocol.certificates?.map((cert) => cert.id).filter((id) => id)
        )

        // Удаляем удостоверения у которых нужный protocolId, но которых нет в новом списке
        const allEntityIds = Object.keys(state.entities)
        const certificatesToRemove = allEntityIds.filter(
          (id) =>
            state.entities[id]?.protocol?.id === protocolId &&
            !newCertificateIds.has(id)
        )

        certificatesToRemove.forEach((id) => {
          certificateAdapter.removeOne(state, id)
        })
      })
      // Создание сотрудника
      .addCase(createEmployeeThunk.fulfilled, (state, action) => {
        if (
          action.payload.data?.certificates &&
          action.payload.data?.certificates.length > 0
        ) {
          certificateAdapter.addMany(state, action.payload.data.certificates)
        }
      })
      // Обновление сотрудника
      .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
        const employee = action.payload.data!
        const employeeId = employee.id!
        const newCertificateIds = new Set(
          employee.certificates?.map((cert) => cert.id).filter((id) => id)
        )

        // Удаляем удостоверения у которых нужный protocolId, но которых нет в новом списке
        const allEntityIds = Object.keys(state.entities)
        const certificatesToRemove = allEntityIds.filter(
          (id) =>
            state.entities[id]?.protocol?.id === employeeId &&
            !newCertificateIds.has(id)
        )

        certificatesToRemove.forEach((id) => {
          certificateAdapter.removeOne(state, id)
        })

        // Добавляем удостоверения с новым protocolId
        if (employee.certificates && employee.certificates.length > 0) {
          certificateAdapter.upsertMany(state, employee.certificates)
        }
      })
      // Удаление сотрудника
      .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
        const employee = action.payload.data!
        const employeeId = employee.id!
        const newCertificateIds = new Set(
          employee.certificates?.map((cert) => cert.id).filter((id) => id)
        )

        // Удаляем удостоверения у которых нужный protocolId, но которых нет в новом списке
        const allEntityIds = Object.keys(state.entities)
        const certificatesToRemove = allEntityIds.filter(
          (id) =>
            state.entities[id]?.protocol?.id === employeeId &&
            !newCertificateIds.has(id)
        )

        certificatesToRemove.forEach((id) => {
          certificateAdapter.removeOne(state, id)
        })
      })
  },
})

export const { actions: certificatesActions, reducer: certificatesReducer } =
  certificatesSlice
