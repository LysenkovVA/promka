"use client"

import React, { memo, useCallback, useMemo, useState } from "react"
import { Berth } from "../../model/types/berth.schema"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  berthesActions,
  berthesReducer,
} from "@/Berthes/model/slice/berthes.slice"
import {
  getBerthes,
  getBerthesSearch,
} from "@/Berthes/model/selectors/berthes.selectors"
import { getBerthesThunk } from "@/Berthes/model/thunks/get-berthes.thunk"
import { useDebounce } from "@/lib/hooks/useDebounce"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@workspace/ui/components/combobox"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@workspace/ui/components/item"
import { Button } from "@workspace/ui/components/button"
import {
  IconDotsVertical,
  IconEditFilled,
  IconPlusFilled,
  IconTrashFilled,
} from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { deleteBerthThunk } from "@/Berthes/model/thunks/delete-berth.thunk"
import { useAuth } from "@/app/(public)/(auth)"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { toast } from "sonner"
import { BerthEditDialog } from "@/Berthes/ui/berth-edit-dialog/berth-edit-dialog"

export interface BerthSelectorProps {
  className?: string
  value?: Berth
  onChange?: (berth?: Berth) => void
}

export const BerthSelector = memo((props: BerthSelectorProps) => {
  const { className, value, onChange } = props

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const data = useAppSelector(getBerthes.selectAll)
  const search = useAppSelector(getBerthesSearch)

  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false)
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)
  const [editBerthId, setEditBerthId] = useState<string | undefined>(undefined)

  const comboBoxData = useMemo(() => {
    if (value && !data?.some((item) => item.id === value.id)) {
      return [...(data ?? []), value]
    }
    return data
  }, [data, value])

  const fetchData = useCallback(
    (replaceData: boolean) => {
      dispatch(getBerthesThunk({ replaceData: replaceData }))
    },
    [dispatch]
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      dispatch(berthesActions.setSearch(value))

      if (!value || value.trim() === "") {
        dispatch(berthesActions.clearData())
      } else {
        fetchData(true)
      }
    },
    [dispatch, fetchData]
  )

  const debouncedSearch = useDebounce(handleSearchChange, 1000)

  const onDeleteCallback = useCallback(async () => {
    try {
      if (value?.id && auth.activeWorkspace.id) {
        const result = await dispatch(
          deleteBerthThunk({
            berthId: value?.id,
            workspaceId: auth.activeWorkspace.id,
          })
        ).unwrap()

        if (result.isOk) {
          toast.success(`Должность удалена`, {
            position: "top-center",
            style: {
              color: "green",
            },
          })

          onChange?.(undefined)
        }
      }
    } catch (error) {
      toast.error((error as string) ?? "Ошибка", {
        position: "top-center",
        style: { color: "tomato" },
      })
    }
  }, [auth.activeWorkspace.id, dispatch, onChange, value?.id])

  return (
    <DynamicModuleLoader
      reducers={{ berthesSchema: berthesReducer }}
      removeAfterUnmount={true}
    >
      <>
        <div className={"flex w-full items-center justify-center gap-1"}>
          <Combobox
            items={comboBoxData}
            itemToStringLabel={(item: Berth) => item.name}
            onValueChange={(selectedValue?) => {
              if (!selectedValue) {
                onChange?.(undefined)
              } else {
                onChange?.({ ...selectedValue })
              }
            }}
            defaultValue={null}
            // Нельзя undefined
            value={value ?? null}
          >
            <ComboboxInput
              className={"w-full"}
              placeholder={"Начните набирать..."}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
            <ComboboxContent>
              {search && (
                <ComboboxEmpty>
                  <div
                    className={
                      "flex flex-col items-center justify-center gap-2"
                    }
                  >
                    <div>{"Ничего не найдено"}</div>
                  </div>
                </ComboboxEmpty>
              )}
              <ComboboxList>
                {(berth: Berth) => (
                  <ComboboxItem key={berth.id} value={berth}>
                    <div className={"flex items-center justify-center gap-3"}>
                      <Item size="xs" className={"p-0"}>
                        <ItemContent>
                          <ItemTitle className="whitespace-nowrap">
                            {berth.name}
                          </ItemTitle>
                          <ItemDescription>{"Тип должности"}</ItemDescription>
                        </ItemContent>
                      </Item>
                    </div>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <Button
            variant={"default"}
            onClick={() => {
              setEditBerthId(undefined)
              setIsOpenEditDialog(true)
            }}
          >
            <IconPlusFilled />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"secondary"} disabled={value?.id === undefined}>
                <IconDotsVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side={"right"} align={"center"} sideOffset={4}>
              <DropdownMenuLabel>
                <div className="text-center text-xs font-light">
                  {value?.name}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup
                className={"flex items-center justify-center gap-3"}
              >
                <DropdownMenuItem asChild>
                  <Button
                    variant={"secondary"}
                    onClick={() => {
                      setEditBerthId(value?.id ?? undefined)
                      setIsOpenEditDialog(true)
                    }}
                  >
                    <IconEditFilled />
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem variant={"destructive"} asChild>
                  <Button
                    variant={"secondary"}
                    onClick={() => setIsOpenDeleteDialog(true)}
                  >
                    <IconTrashFilled />
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isOpenEditDialog && (
          <BerthEditDialog
            isOpen={isOpenEditDialog}
            onOpenChange={(isOpen) => setIsOpenEditDialog(isOpen)}
            berthId={editBerthId}
            onSubmit={(submittedBerth) => {
              onChange?.({ ...submittedBerth })
              setIsOpenEditDialog(false)
              setEditBerthId(undefined)
            }}
            onClose={() => {
              setIsOpenEditDialog(false)
              setEditBerthId(undefined)
            }}
          />
        )}
        {isOpenDeleteDialog && (
          <Dialog
            open={isOpenDeleteDialog}
            onOpenChange={(isOpen) => setIsOpenDeleteDialog(isOpen)}
          >
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>{"Удаление"}</DialogTitle>
                <DialogDescription>{`Вы действительно хотите удалить должность "${value?.name}"?`}</DialogDescription>
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
                      await onDeleteCallback()
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
      </>
    </DynamicModuleLoader>
  )
})
