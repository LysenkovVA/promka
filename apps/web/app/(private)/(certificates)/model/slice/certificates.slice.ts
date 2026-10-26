import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { TAKE } from "@/config/app"
import { getCertificatesThunk } from "../thunks/get-certificates.thunk"
import { certificateAdapter } from "../adapter/certificate.adapter"
import { updateCertificateThunk } from "../thunks/update-certificate.thunk"
import { deleteCertificateThunk } from "../thunks/delete-certificate.thunk"
import { Certificate } from "../types/certificate.schema"
import { CertificateFilters } from "../types/certificate.filters"
import { createCertificateThunk } from "@/Certificates/model/thunks/create-certificate.thunk"
import { createProtocolThunk } from "@/Protocols"
import { updateProtocolThunk } from "@/Protocols/model/thunks/update-protocol.thunk"
import { deleteProtocolThunk } from "@/Protocols/model/thunks/delete-protocol.thunk"

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
      // Создание
      .addCase(createCertificateThunk.fulfilled, (state, action) => {
        certificateAdapter.addOne(state, action.payload.data!)
      })
      // Обновление
      .addCase(updateCertificateThunk.fulfilled, (state, action) => {
        certificateAdapter.upsertOne(state, action.payload.data!)
      })
      // Удаление
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
        // const protocolId = action.payload.data?.id!
        //
        // // Удаляем удостоверения у которых нужный protocolId
        // for (const [key, value] of Object.entries(state.entities)) {
        //   if (value.protocol.id === protocolId) {
        //     certificateAdapter.removeOne(state, key)
        //   }
        // }
        // // Добавляем удостоверения protocolId
        // if (
        //   action.payload.data?.certificates &&
        //   action.payload.data?.certificates.length > 0
        // ) {
        //   certificateAdapter.addMany(state, action.payload.data.certificates)
        // }
      })
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
  },
})

export const { actions: certificatesActions, reducer: certificatesReducer } =
  certificatesSlice
