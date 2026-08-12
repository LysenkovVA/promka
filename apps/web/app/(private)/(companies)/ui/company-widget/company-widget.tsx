"use client"

import { memo, useCallback, useState } from "react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@workspace/ui/components/item"
import { ICompanyEntity } from "@/app/(private)/(companies)"
import {
  IconEditFilled,
  IconLocationPin,
  IconRosetteDiscountCheck,
  IconTrash,
} from "@tabler/icons-react"
import { EditCompanySheet } from "@/app/(private)/(companies)/ui/edit-company-sheet/edit-company-sheet"
import { Button } from "@workspace/ui/components/button"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/redux"
import { getAuthData } from "@/app/(auth)/model/selectors/authSelectors"
import { YesNoDialog } from "@/components/YesNoDialog/YesNoDialog"
import { deleteCompanyByIdThunk } from "@/app/(private)/(companies)/model/thunks/delete-company-by-id-thunk"
import { toast } from "sonner"

export interface CompanyWidgetProps {
  company: ICompanyEntity
}

export const CompanyWidget = memo((props: CompanyWidgetProps) => {
  const { company } = props

  const [sheetIsOpen, setSheetIsOpen] = useState(false)
  const [deleteModalIsOpen, setdeleteModalIsOpen] = useState(false)

  const dispatch = useAppDispatch()
  const authData = useAppSelector(getAuthData)

  const router = useRouter()

  const deleteOrganizationCallback = useCallback(async () => {
    if (company?.id) {
      const result = await dispatch(deleteCompanyByIdThunk({ id: company.id }))

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Организация удалена", { position: "top-center" })
      } else {
        toast.error(JSON.stringify(result.payload))
      }
    }
  }, [company.id, dispatch])

  return (
    <>
      <Item
        className={"min-h-44 w-full cursor-pointer"}
        variant={"outline"}
        onClick={() => {
          // dispatch(
          //   authActions.setData({ ...authData!, activeCompany: company })
          // )
          router.push(`/dashboard?workspaceId=${company.workspace?.id}`)
        }}
      >
        <ItemContent className={"h-full w-full"}>
          <div className={"flex h-full flex-col items-center justify-between"}>
            <div className={"h-full w-full"}>
              <ItemTitle
                className={
                  "align-center flex w-full justify-center text-center text-xl font-light"
                }
              >
                {company.name}
              </ItemTitle>
              {company.address && (
                <div className={"flex w-full items-center justify-start gap-2"}>
                  <IconLocationPin className={"size-4! w-fit flex-shrink-0"} />
                  <ItemDescription className={"text-md text-start font-light"}>
                    {company.address}
                  </ItemDescription>
                </div>
              )}
            </div>
            <div className={"m-auto flex items-center justify-center gap-1"}>
              <IconRosetteDiscountCheck
                stroke={2}
                className={"size-4 text-green-500"}
              />
              <div className={"text-sm text-green-500"}>{"Всё в порядке"}</div>
            </div>
          </div>
        </ItemContent>
        <ItemActions
          className={"flex h-full flex-col items-center justify-center"}
        >
          <Button
            className={"cursor-pointer"}
            variant={"outline"}
            onClick={(e) => {
              e.stopPropagation()
              setSheetIsOpen(true)
            }}
          >
            <IconEditFilled className={"fill-orange-300"} />
          </Button>
          <Button
            className={"cursor-pointer"}
            variant={"outline"}
            onClick={(e) => {
              e.stopPropagation()
              setdeleteModalIsOpen(true)
            }}
          >
            <IconTrash className={"text-red-400"} />
          </Button>
        </ItemActions>
      </Item>
      {sheetIsOpen && (
        <EditCompanySheet
          isOpen={sheetIsOpen}
          handleOpenChange={(isOpen) => setSheetIsOpen(isOpen)}
          companyId={company?.id ?? undefined}
        />
      )}
      {deleteModalIsOpen && (
        <YesNoDialog
          isOpen={deleteModalIsOpen}
          onOpenChange={(isOpen) => setdeleteModalIsOpen(isOpen)}
          title={"Удаление"}
          content={"Удалить выбранную организацию?"}
          onSubmit={async () => {
            setdeleteModalIsOpen(false)
            await deleteOrganizationCallback()
          }}
          onClose={() => setdeleteModalIsOpen(false)}
        />
      )}
    </>
  )
})
