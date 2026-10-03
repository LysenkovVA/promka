"use client"

import React, { ReactNode, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Button } from "@workspace/ui/components/button"
import {
  IconCheck,
  IconChevronDown,
  IconDotsVertical,
  IconEditFilled,
  IconFidgetSpinner,
  IconPlusFilled,
  IconSearch,
  IconTrashFilled,
  IconXFilled,
} from "@tabler/icons-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { ButtonGroup } from "@workspace/ui/components/button-group"

export interface SelectorProps<TValue> {
  isOpen: boolean
  onOpenChange: (isOpened: boolean) => void
  selectedValue: TValue | null
  onRenderSelectedValue: () => ReactNode
  onChangeSelectedValue: (selectedValue: TValue | null) => void
  searchValue: string
  searchPlaceholder?: string
  onSearchValueChange: (searchValue: string) => void
  isSearching: boolean
  items: TValue[] | null
  onRenderItem: (item: TValue) => ReactNode
  actionsLabel?: string
  onAddClick?: () => void
  onEditClick?: (item: TValue | null) => void
  onDeleteClick?: (item: TValue | null) => void
  deleteMessage?: string
}

export function Selector<TValue>(props: SelectorProps<TValue>) {
  const {
    isOpen,
    onOpenChange,
    selectedValue,
    onRenderSelectedValue,
    onChangeSelectedValue,
    searchValue,
    searchPlaceholder = "Найти...",
    onSearchValueChange,
    isSearching,
    items,
    onRenderItem,
    actionsLabel = "Действия",
    onAddClick,
    onEditClick,
    onDeleteClick,
    deleteMessage = "Вы действительно хотите удалить запись?",
  } = props

  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)

  return (
    <div className={"flex w-full flex-row items-center justify-start gap-2"}>
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger className={"w-full"} asChild>
          <Button
            className={
              "flex w-full items-center justify-between text-start text-gray-600"
            }
            variant={"outline"}
          >
            {onRenderSelectedValue()}
            <div className={"flex items-center justify-center gap-2"}>
              {selectedValue && (
                <div
                  className="flex cursor-pointer items-center justify-center rounded-lg bg-muted p-1"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onChangeSelectedValue(null)
                    onOpenChange(false)
                  }}
                >
                  <IconXFilled className="fill-destructive" />
                </div>
              )}
              <IconChevronDown />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent align={"start"} side={"bottom"} className={"w-full"}>
          <InputGroup>
            <InputGroupInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => {
                onSearchValueChange(e.target.value)
              }}
            />
            <InputGroupAddon align="inline-start">
              {isSearching ? (
                <IconFidgetSpinner className={"animate-spin"} />
              ) : (
                <IconSearch className="text-muted-foreground" />
              )}
            </InputGroupAddon>
          </InputGroup>
          {items?.map((value, index) => (
            <div
              className={
                "flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-2 bg-muted p-1"
              }
              key={Object(value)?.["id"] ?? index}
              onClick={() => {
                onChangeSelectedValue(value)
                onOpenChange(false)
              }}
            >
              <IconCheck
                className={`opacity-${Object(selectedValue)?.["id"] === Object(value)?.["id"] ? 50 : 0}`}
              />
              {onRenderItem(value)}
            </div>
          ))}
          {items && items.length === 0 && searchValue && !isSearching && (
            <div
              className={
                "flex w-full flex-col items-center justify-center gap-1 text-center text-gray-400"
              }
            >
              {"Ничего не найдено"}
            </div>
          )}
        </PopoverContent>
      </Popover>
      <div className={"flex flex-row items-center justify-center gap-0"}>
        <Button variant={"default"} size={"icon"} onClick={onAddClick}>
          <IconPlusFilled />
        </Button>
        {/*Кнопка с точками*/}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"secondary"}
              disabled={Object(selectedValue)?.["id"] === undefined}
            >
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={"w-fit min-w-0 p-1"}
            side={"right"}
            align={"center"}
            sideOffset={4}
          >
            {Object(selectedValue)?.["id"] && (
              <>
                <DropdownMenuLabel>
                  <div className="text-center text-xs font-light">
                    {actionsLabel}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuGroup
              className={"flex items-center justify-center gap-1"}
            >
              <DropdownMenuItem asChild>
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  onClick={() => onEditClick?.(selectedValue)}
                >
                  <IconEditFilled />
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem variant={"destructive"} asChild>
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  onClick={() => setIsOpenDeleteDialog(true)}
                >
                  <IconTrashFilled />
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {onDeleteClick && isOpenDeleteDialog && Object(selectedValue)?.["id"] && (
        <Dialog
          open={isOpenDeleteDialog}
          onOpenChange={(isOpen) => setIsOpenDeleteDialog(isOpen)}
        >
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>{"Удаление"}</DialogTitle>
              <DialogDescription>{deleteMessage}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <ButtonGroup>
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    setIsOpenDeleteDialog(false)
                  }}
                >
                  {"Отмена"}
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={async () => {
                    onDeleteClick(selectedValue)
                    setIsOpenDeleteDialog(false)
                  }}
                >
                  {"Удалить"}
                </Button>
              </ButtonGroup>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
