import { companyAdapter } from "@/app/(private)/(companies)/model/adapter/companyAdapter"
import { GlobalStateSchema } from "@/lib/redux"

// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
const getInitialState = companyAdapter.getInitialState()

export const getCompaniesSimpleList =
  companyAdapter.getSelectors<GlobalStateSchema>(
    (state) => state.companiesSimpleListSchema ?? getInitialState
  )

export const getCompaniesSimpleListIsFetching = (state: GlobalStateSchema) => {
  return state.companiesSimpleListSchema?.isFetching ?? false
}

export const getCompaniesSimpleListError = (state: GlobalStateSchema) => {
  return state.companiesSimpleListSchema?.error ?? ""
}

export const getCompaniesSimpleListIsInitialized = (
  state: GlobalStateSchema
) => {
  return state.companiesSimpleListSchema?._isInitialized ?? false
}
