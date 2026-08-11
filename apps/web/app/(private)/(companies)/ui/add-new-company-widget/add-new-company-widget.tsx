"use client"

import { memo, useState } from "react"
import { IconCirclePlusFilled } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { EditCompanySheet } from "@/app/(private)/(companies)/ui/edit-company-sheet/edit-company-sheet"

export interface AddNewCompanyWidgetProps {}

export const AddNewCompanyWidget = memo((props: AddNewCompanyWidgetProps) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false)

  return (
    <>
      <Button
        className={
          "m-auto flex h-full min-h-44 w-full cursor-pointer items-center justify-center"
        }
        variant={"outline"}
        onClick={() => setSheetIsOpen(true)}
      >
        <IconCirclePlusFilled className={"size-10 fill-green-500"} />
        <div className={"font-light text-gray-600"}>Добавить ещё</div>
      </Button>
      {sheetIsOpen && (
        <EditCompanySheet
          isOpen={sheetIsOpen}
          handleOpenChange={(isOpen) => setSheetIsOpen(isOpen)}
          companyId={undefined}
        />
      )}
    </>
  )
})
