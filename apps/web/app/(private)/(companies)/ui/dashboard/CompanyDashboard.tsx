"use client"

import { memo, useEffect } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { companyDetailsReducer } from "@/app/(private)/(companies)/model/slice/company-details-slice"
import { getCompanyDetailsData } from "@/app/(private)/(companies)/model/selectors/company-details-selectors"
import { getCompanyByIdThunk } from "@/app/(private)/(companies)/model/thunks/get-company-by-id-thunk"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ICompanyEntity } from "@/app/(private)/(companies)"
import { changeActiveCompanyThunk } from "@/app/(auth)/model/thunks/changeActiveCompanyThunk"
import { getCompaniesSimpleList } from "@/app/(private)/(companies)/model/selectors/companies-simple-list-selectors"

export interface CompanyDashboardProps {
  workspaceId: string
}

export const CompanyDashboard = memo((props: CompanyDashboardProps) => {
  const { workspaceId } = props

  const dispatch = useAppDispatch()
  const data = useAppSelector(getCompanyDetailsData)
  const companies = useAppSelector(getCompaniesSimpleList.selectAll)

  useEffect(() => {
    const comp = companies?.find((c) => c.workspace?.id === workspaceId)
    if (comp && comp.id) {
      dispatch(getCompanyByIdThunk({ id: comp.id })).then((data) => {
        const company = data.payload as ResponseData<ICompanyEntity>

        if (company?.data) {
          dispatch(changeActiveCompanyThunk({ company: company.data }))
        }
      })
    }
  }, [companies, dispatch, workspaceId])

  return (
    <DynamicModuleLoader
      reducers={{ companyDetailsSchema: companyDetailsReducer }}
      removeAfterUnmount={true}
    >
      <div className={"m-auto flex flex-col items-center justify-start gap-10"}>
        <div
          className={
            "m-auto flex w-full flex-col items-start justify-center gap-1"
          }
        >
          <div className={"text-xl"}>{data?.name}</div>
          <div className={"text-sm text-gray-400"}>{data?.address}</div>
        </div>
      </div>
    </DynamicModuleLoader>
  )
})
