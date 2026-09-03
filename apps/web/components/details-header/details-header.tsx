"use client"

import { memo } from "react"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { Button } from "@workspace/ui/components/button"
import {
  IconArrowLeft,
  IconEditFilled,
  IconTrashFilled,
} from "@tabler/icons-react"
import { Separator } from "@workspace/ui/components/separator"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"

export interface DetailsHeaderProps {
  children?: React.ReactNode
  onEditClick?: () => void
  onDeleteClick?: () => void
  deleteMessage?: string
}

export const DetailsHeader = memo((props: DetailsHeaderProps) => {
  const {
    children,
    onEditClick,
    onDeleteClick,
    deleteMessage = "Вы действительно хотите удалить эту запись со всеми связанными данными?",
  } = props

  const router = useRouter()

  return (
    <>
      <div className={"flex flex-row items-center justify-between gap-3"}>
        <ButtonGroup>
          <Button
            variant="outline"
            aria-label="Go Back"
            onClick={() => router.back()}
          >
            <IconArrowLeft />
            {"Назад"}
          </Button>
        </ButtonGroup>
        <ButtonGroup className={"gap-1"}>
          <Button variant={"secondary"} onClick={onEditClick}>
            <IconEditFilled />
            {"Изменить"}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"destructive"}>
                <IconTrashFilled />
                {"Удалить"}
              </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>{"Удаление"}</DialogTitle>
                <DialogDescription>{deleteMessage}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <ButtonGroup>
                    <Button variant={"secondary"}>{"Отмена"}</Button>
                    <Button variant={"destructive"} onClick={onDeleteClick}>
                      {"Удалить"}
                    </Button>
                  </ButtonGroup>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ButtonGroup>
      </div>
      <Separator />
      {children}
    </>
  )
})
