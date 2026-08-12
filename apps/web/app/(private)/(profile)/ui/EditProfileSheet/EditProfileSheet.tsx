"use client"

import { memo, useCallback, useState } from "react"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { useUser } from "@/app/(auth)"
import { useAppDispatch } from "@/lib/redux"
import { upsertUserThunk } from "@/app/(private)/(users)/model/thunks/upsertUserThunk"
import { toast } from "sonner"
import { EditSheet } from "@/components/EditSheet/EditSheet"
import { Button } from "@workspace/ui/components/button"

export const EditProfileSheet = memo(() => {
  const { user } = useUser()
  // const [isOpen, setIsOpen] = useState(false)
  const [editUser, setEditUser] = useState(user)
  const dispatch = useAppDispatch()

  const onSubmit = useCallback(async () => {
    if (editUser) {
      const result = await dispatch(upsertUserThunk({ entityData: editUser }))
      // setIsOpen(false) // закрываем Sheet
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Изменения сохранены")
        return true
      } else {
        //TODO показывать реальную ошибку
        toast.error("Ошибка!")
      }
      return false
    }
  }, [dispatch, editUser])

  return (
    <EditSheet
      sheetTitle={
        <div
          className={
            "m-auto flex w-fit flex-row items-center justify-start gap-1"
          }
        >
          <div>{"Профиль"}</div>
        </div>
      }
      sheetDescription={"Изменение данных профиля"}
      onSubmit={onSubmit}
      trigger={<Button variant={"outline"}>{"Изменить"}</Button>}
    >
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <div className="grid gap-3">
          <Label htmlFor="sheet-surname">Фамилия</Label>
          <Input
            id="sheet-surname"
            value={editUser?.surname ?? ""}
            onChange={(e) =>
              setEditUser({ ...editUser!, surname: e.target.value })
            }
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="sheet-name">Имя</Label>
          <Input
            id="sheet-name"
            value={editUser?.name ?? ""}
            onChange={(e) =>
              setEditUser({ ...editUser!, name: e.target.value })
            }
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="sheet-phone">Телефон</Label>
          <Input
            id="sheet-phone"
            value={editUser?.phoneNumber ?? ""}
            onChange={(e) =>
              setEditUser({ ...editUser!, phoneNumber: e.target.value })
            }
          />
        </div>
      </div>
    </EditSheet>
  )
})
