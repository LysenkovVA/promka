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
      <div className={"flex flex-row items-center justify-between gap-3"}>
        <ButtonGroup>
          <Button variant="outline" onClick={onBackClick}>
            <IconArrowLeft />
            {"Назад"}
          </Button>
        </ButtonGroup>
        {buttonsContent}
      </div>
      {/*Контент или ошибка*/}
      {error ? <div className={"text-destructive"}>{error}</div> : children}
      {/*Кнопка удаления в режиме редактирования без ошибки*/}
      {!error && isEdit && onDeleteClick && (
        <>
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
        </>
      )}
    </div>
  )
})
