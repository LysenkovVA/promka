"use client"

import { memo } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"
import { BreadcrumbItem } from "@workspace/ui/components/breadcrumb"
import { useActiveCompany } from "@/app/(auth)/model/hooks/useActiveCompany"
import { useAppDispatch, useAppSelector } from "@/lib/redux"
import { getCompaniesSimpleList } from "@/app/(private)/(companies)/model/selectors/companies-simple-list-selectors"
import { useRouter } from "next/navigation"

export const HeaderMenuCompaniesItem = memo((_) => {
  const dispatch = useAppDispatch()

  const activeCompany = useActiveCompany()
  const companies = useAppSelector(getCompaniesSimpleList.selectAll)

  const router = useRouter()

  return (
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1">
            {activeCompany?.name}
            <ChevronDownIcon data-icon="inline-end" className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {companies.map((company) => (
              <DropdownMenuItem
                key={company.id}
                onClick={() => {
                  router.push(`/dashboard?workspaceId=${company.workspace?.id}`)
                  // dispatch(
                  //   changeActiveCompanyThunk({
                  //     company: companies?.find((c) => c.id === company.id),
                  //   })
                  // )
                }}
              >
                {company.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
  )
})
