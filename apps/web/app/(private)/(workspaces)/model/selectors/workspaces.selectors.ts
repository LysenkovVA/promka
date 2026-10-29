// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
import { workspaceAdapter } from "../adapter/workspace.adapter"
import { GlobalStateSchema } from "@/lib/redux"

const getInitialState = workspaceAdapter.getInitialState()

export const getWorkspaces = workspaceAdapter.getSelectors<GlobalStateSchema>(
  (state) => state.workspacesSchema ?? getInitialState
)

export const getWorkspacesIsLoading = (state: GlobalStateSchema) => {
  return state.workspacesSchema?.isLoading ?? false
}

export const getWorkspacesError = (state: GlobalStateSchema) => {
  return state.workspacesSchema?.error ?? ""
}

export const getWorkspacesIsInitialized = (state: GlobalStateSchema) => {
  return state.workspacesSchema?._isInitialized ?? false
}

export const getWorkspacesTake = (state: GlobalStateSchema) => {
  return state.workspacesSchema?.take ?? 10
}

export const getWorkspacesSkip = (state: GlobalStateSchema) => {
  return state.workspacesSchema?.skip ?? 0
}

export const getWorkspacesSearch = (state: GlobalStateSchema) => {
  return state.workspacesSchema?.search ?? ""
}

export const getWorkspacesTotalCount = (state: GlobalStateSchema) => {
  return state.workspacesSchema?.totalCount ?? 0
}

export const getWorkspacesHasMore = (state: GlobalStateSchema) => {
  return state.workspacesSchema?.hasMore ?? true
}

export const getWorkspacesFilters = (state: GlobalStateSchema) => {
  return state.workspacesSchema?.filters ?? undefined
}

export const getWorkspacesFormDataFilters = (state: GlobalStateSchema) => {
  return state.workspacesSchema?.formDataFilters ?? undefined
}
