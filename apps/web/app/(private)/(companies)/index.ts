import { ICompanyEntity } from "./model/types/ICompanyEntity"
import {
  companiesSimpleListActions,
  companiesSimpleListReducer,
} from "./model/slice/companies-simple-list-slice"
import { useCompaniesSimpleList } from "./hooks/useCompaniesSimpleList"
import { CompanyWidget } from "./ui/company-widget/company-widget"

export {
  companiesSimpleListActions,
  companiesSimpleListReducer,
  useCompaniesSimpleList,
  CompanyWidget,
}
export type { ICompanyEntity }
