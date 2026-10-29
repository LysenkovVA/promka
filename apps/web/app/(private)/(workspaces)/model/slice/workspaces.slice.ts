import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { Workspace } from "../types/workspace.schema"
import { WorkspaceFilters } from "../types/workspace.filters"
import { TAKE } from "@/config/app"
import { workspaceAdapter } from "../adapter/workspace.adapter"
import { changeActiveWorkspaceThunk, logoutThunk } from "@/app/(public)/(auth)"
import { getWorkspacesThunk } from "../thunks/get-workspaces.thunk"
import { updateWorkspaceThunk } from "../thunks/update-workspace.thunk"
import { createWorkspaceThunk } from "../thunks/create-workspace.thunk"

const initialState: ListReduxSchema<Workspace, WorkspaceFilters> = {
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

export const workspacesSlice = createSlice({
  name: "workspacesSlice",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string | undefined>) => {
      state.search = action.payload
    },
    setFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<WorkspaceFilters, string[] | undefined> | undefined
      >
    ) => {
      state.filters = action.payload
      state.formDataFilters = action.payload
    },
    setFormDataFilters: (
      state,
      action: PayloadAction<
        OptionalRecord<WorkspaceFilters, string[] | undefined> | undefined
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
        workspaceAdapter.removeAll(state)
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
        workspaceAdapter.removeAll(state)
      })
      .addCase(getWorkspacesThunk.pending, (state, action) => {
        state.isLoading = true
        state.error = undefined

        if (action.meta.arg.replaceData) {
          state.take = TAKE
          state.skip = 0
          state.totalCount = 0
          state.hasMore = true
        }
      })
      .addCase(getWorkspacesThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = undefined

        // Если данные заменяются
        if (action.meta.arg.replaceData) {
          // Заменяем данные
          workspaceAdapter.setAll(state, action.payload.data!)
        } else {
          // Добавляем порцию данных
          workspaceAdapter.addMany(state, action.payload.data!)
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
      .addCase(getWorkspacesThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload

        state._isInitialized = true
      })
      // Добавление
      .addCase(createWorkspaceThunk.fulfilled, (state, action) => {
        workspaceAdapter.addOne(state, action.payload.data!)
      })
      // Обновление
      .addCase(updateWorkspaceThunk.fulfilled, (state, action) => {
        workspaceAdapter.upsertOne(state, action.payload.data!)
      })
    // // Удаление
    // .addCase(deleteWorkspaceThunk.fulfilled, (state, action) => {
    //   if (action.payload.data?.id) {
    //     workspaceAdapter.removeOne(state, action.payload.data?.id)
    //   }
    // })
  },
})

export const { actions: workspacesActions, reducer: workspacesReducer } =
  workspacesSlice
