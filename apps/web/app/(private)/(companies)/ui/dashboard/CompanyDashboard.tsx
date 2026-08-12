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
import { getAuthData } from "@/app/(auth)/model/selectors/authSelectors"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ICompanyEntity } from "@/app/(private)/(companies)"
import { changeActiveCompanyThunk } from "@/app/(auth)/model/thunks/changeActiveCompanyThunk"

export interface CompanyDashboardProps {
  companyId: string
}

export const CompanyDashboard = memo((props: CompanyDashboardProps) => {
  const { companyId } = props

  const dispatch = useAppDispatch()
  const data = useAppSelector(getCompanyDetailsData)
  const authData = useAppSelector(getAuthData)

  useEffect(() => {
    dispatch(getCompanyByIdThunk({ id: companyId })).then((data) => {
      const company = data.payload as ResponseData<ICompanyEntity>

      if (company?.data) {
        // dispatch(
        //   authActions.setData({ ...authData!, activeCompany: company.data })
        // )
        dispatch(changeActiveCompanyThunk({ company: company.data }))
      }
    })
  }, [companyId, dispatch])

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
