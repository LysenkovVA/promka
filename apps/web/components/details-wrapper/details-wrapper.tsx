"use client"

import { memo, useMemo } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconEditFilled,
  IconTrashFilled,
} from "@tabler/icons-react"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { Separator } from "@workspace/ui/components/separator"
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
import { PageWrapper } from "@/components/page-wrapper/page-wrapper"

export interface DetailsWrapperProps {
  children?: React.ReactNode
  isEdit: boolean
  onBackClick?: () => void
  onEditClick?: () => void
  onSaveClick?: () => void
  deleteMessage?: string
  onDeleteClick?: () => void
  error?: string
}

/**
 * Обертка для редактирования записи
 * с кнопками
 */
export const DetailsWrapper = memo((props: DetailsWrapperProps) => {
  const {
    children,
    isEdit,
    onBackClick,
    onEditClick,
    onSaveClick,
    deleteMessage = "Вы действительно хотите удалить запись?",
    onDeleteClick,
    error,
  } = props

  const buttonsContent = useMemo(() => {
    if (error) {
      return null
    }

    return isEdit ? (
      <ButtonGroup>
        <Button variant={"default"} onClick={onSaveClick}>
          <IconDeviceFloppy />
          {"Сохранить"}
        </Button>
      </ButtonGroup>
    ) : (
      <ButtonGroup>
        <Button variant={"secondary"} onClick={onEditClick}>
          <IconEditFilled />
          {"Редактировать"}
        </Button>
      </ButtonGroup>
    )
  }, [error, isEdit, onEditClick, onSaveClick])

  return (
    <div className={"flex w-full flex-col gap-4"}>
      {/*Кнопки*/}
      <div
        className={
          "flex flex-shrink-0 flex-row items-center justify-between gap-3 bg-muted p-4"
        }
      >
        <ButtonGroup>
          <Button variant="outline" onClick={onBackClick}>
            <IconArrowLeft />
            {"Назад"}
          </Button>
        </ButtonGroup>
        {buttonsContent}
      </div>
      {/*Контент или ошибка*/}
      <PageWrapper className={"flex-1 overflow-y-auto"}>
        {error ? <div className={"text-destructive"}>{error}</div> : children}
        {/*Кнопка удаления в режиме редактирования без ошибки*/}
        {!error && isEdit && onDeleteClick && (
          <div
            className={
              "m-auto mt-4 flex flex-col items-center justify-center gap-3"
            }
          >
            <Separator />
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
          </div>
        )}
      </PageWrapper>
    </div>
  )
})
