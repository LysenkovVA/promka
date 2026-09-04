"use client"

import { memo, useCallback, useEffect, useState } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { employeeDetailsReducer } from "../../model/slice/employee-details.slice"
import { Avatar } from "@workspace/ui/components/avatar"
import {
  getEmployeeDetailsData,
  getEmployeeDetailsError,
} from "../../model/selectors/employee-details.selectors"
import { getEmployeeByIdThunk } from "../../model/thunks/get-employee-by-id.thunk"
import { DetailsHeader } from "@/components/details-header/details-header"
import { EditEmployeeSheet } from "../edit-employee-sheet/edit-employee-sheet"
import { deleteEmployeeThunk } from "../../model/thunks/delete-employee.thunk"
import { useAuth } from "@/app/(public)/(auth)"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { EmployeeHelper } from "@/Employees/helpers/employee-helper"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@workspace/ui/components/marker"
import {
  IconAddressBook,
  IconCalendar,
  IconId,
  IconMail,
  IconPhone,
} from "@tabler/icons-react"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
} from "@workspace/ui/components/item"
import dayjs from "dayjs"

export interface EmployeeDetailsProps {
  employeeId?: string
}

export const EmployeeDetails = memo((props: EmployeeDetailsProps) => {
  const { employeeId } = props

  const dispatch = useAppDispatch()
  const data = useAppSelector(getEmployeeDetailsData)
  const error = useAppSelector(getEmployeeDetailsError)

  const [editSheetIsOpen, setEditSheetIsOpen] = useState(false)

  const auth = useAuth()

  const router = useRouter()

  useEffect(() => {
    if (employeeId) dispatch(getEmployeeByIdThunk({ employeeId: employeeId }))
  }, [dispatch, employeeId])

  const onDeleteCallback = useCallback(async () => {
    try {
      if (auth.activeWorkspace.id && employeeId) {
        const result = await dispatch(
          deleteEmployeeThunk({
            employeeId: employeeId,
            workspaceId: auth.activeWorkspace.id,
          })
        ).unwrap()

        if (result.isOk) {
          toast.success(`Сотрудник '${data?.surname}' удалён`, {
            position: "top-center",
            style: {
              color: "green",
            },
          })
          router.back()
        }
      }
    } catch (error) {
      toast.error((error as string) ?? "Ошибка", {
        position: "top-center",
        style: { color: "tomato" },
      })
    }
  }, [auth.activeWorkspace?.id, data?.surname, dispatch, employeeId, router])

  return (
    <DynamicModuleLoader
      reducers={{ employeeDetailsSchema: employeeDetailsReducer }}
      removeAfterUnmount={true}
    >
      <div className={"flex w-full flex-col gap-4"}>
        <DetailsHeader
          onEditClick={() => setEditSheetIsOpen(true)}
          onDeleteClick={onDeleteCallback}
          deleteMessage={`Вы действительно хотите удалить '${data?.surname}' со всеми связанными данными?`}
        >
          <EditEmployeeSheet
            isOpen={editSheetIsOpen}
            handleOpenChange={(e) => setEditSheetIsOpen(e)}
            employeeId={employeeId}
          />
        </DetailsHeader>
        <div className={"flex w-full flex-col items-start justify-start gap-3"}>
          {error && <div>{error}</div>}
          <div
            className={"flex w-full flex-row items-center justify-center gap-4"}
          >
            <Avatar style={{ width: 100, height: 100 }} />
            <div
              className={
                "flex w-full flex-col items-start justify-center gap-1"
              }
            >
              <div style={{ fontSize: 30, fontWeight: "bold" }}>
                {data?.surname}
              </div>
              <div style={{ fontSize: 20 }}>
                {EmployeeHelper.getFullName(data)}
              </div>
              {/*<div style={{ fontSize: 20 }}>{data?.patronymic}</div>*/}
              {data?.workspace?.company?.id && (
                <div>{data?.workspace?.company.name}</div>
              )}
            </div>
          </div>
          {data?.birthDate && (
            <Item variant={"muted"}>
              <ItemMedia variant={"icon"}>
                <IconCalendar />
              </ItemMedia>
              <ItemContent>
                <ItemDescription> {"Дата рождения"}</ItemDescription>
                {dayjs(data.birthDate).format("DD.MM.YYYY")}
              </ItemContent>
            </Item>
          )}
          {data?.snils && (
            <Item variant={"muted"}>
              <ItemMedia variant={"icon"}>
                <IconId />
              </ItemMedia>
              <ItemContent>
                <ItemDescription> {"СНИЛС"}</ItemDescription>
                {data.snils}
              </ItemContent>
            </Item>
          )}
          {data?.hireDate && (
            <Item variant={"muted"}>
              <ItemMedia variant={"icon"}>
                <IconCalendar />
              </ItemMedia>
              <ItemContent>
                <ItemDescription> {"Принят на работу"}</ItemDescription>
                {dayjs(data.hireDate).format("DD.MM.YYYY")}
              </ItemContent>
            </Item>
          )}
          {data?.firedDate && (
            <Item variant={"muted"}>
              <ItemMedia variant={"icon"}>
                <IconCalendar />
              </ItemMedia>
              <ItemContent>
                <ItemDescription> {"Уволен"}</ItemDescription>
                {dayjs(data.firedDate).format("DD.MM.YYYY")}
              </ItemContent>
            </Item>
          )}
          <Marker variant="border">
            <MarkerIcon>
              <IconAddressBook />
            </MarkerIcon>
            <MarkerContent>Контакты</MarkerContent>
          </Marker>
          {data?.phoneNumber && (
            <Item variant={"muted"}>
              <ItemMedia variant={"icon"}>
                <IconPhone />
              </ItemMedia>
              <ItemContent>
                <ItemDescription> {"Телефон"}</ItemDescription>
                {data.phoneNumber}
              </ItemContent>
            </Item>
          )}
          {data?.email && (
            <Item variant={"muted"}>
              <ItemMedia variant={"icon"}>
                <IconMail />
              </ItemMedia>
              <ItemContent>
                <ItemDescription> {"E-mail"}</ItemDescription>
                {data.email}
              </ItemContent>
            </Item>
          )}
        </div>
      </div>
    </DynamicModuleLoader>
  )
})
