"use client"

import { memo, useEffect } from "react"
import {
  companiesSimpleListReducer,
  CompanyWidget,
  useCompaniesSimpleList,
} from "@/app/(private)/(companies)"
import { CompanyWidgetSkeleton } from "../company-widget/company-widget-skeleton"
import { DynamicModuleLoader, useAppDispatch } from "@/lib/redux"
import { AddNewCompanyWidget } from "@/app/(private)/(companies)/ui/add-new-company-widget/add-new-company-widget"
import { useSearchParams } from "next/navigation"
import { CompanyDashboard } from "@/app/(private)/(companies)/ui/dashboard/CompanyDashboard"
import { changeActiveCompanyThunk } from "@/app/(auth)/model/thunks/changeActiveCompanyThunk"

export interface CompaniesWidgetListProps {}

export const CompaniesWidgetList = memo((props: CompaniesWidgetListProps) => {
  const { data, isFetching } = useCompaniesSimpleList()

  const searchParams = useSearchParams()
  const workspaceId = searchParams.get("workspaceId")

  const dispatch = useAppDispatch()

  useEffect(() => {
    // dispatch(authActions.setData({ ...authData!, activeCompany: undefined }))
    dispatch(changeActiveCompanyThunk({ company: undefined }))
  }, [])

  if (workspaceId) {
    return <CompanyDashboard workspaceId={workspaceId} />
  }

  return (
    <DynamicModuleLoader
      reducers={{ companiesSimpleListSchema: companiesSimpleListReducer }}
      removeAfterUnmount={false}
    >
      <div className={"mb-4 text-xl font-bold"}>Мои организации</div>
      <div className="grid w-full grid-cols-3 gap-2 p-2 font-light">
        {isFetching
          ? [...Array(3)].map((_, i) => <CompanyWidgetSkeleton key={i} />)
          : data?.map((company) => {
              return <CompanyWidget key={company.id} company={company} />
            })}
        {!isFetching && <AddNewCompanyWidget />}
      </div>
    </DynamicModuleLoader>
  )
})
