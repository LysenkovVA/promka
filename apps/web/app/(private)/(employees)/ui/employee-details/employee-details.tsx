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
  getEmployeeDetailsFormData,
} from "../../model/selectors/employee-details.selectors"
import { getEmployeeByIdThunk } from "../../model/thunks/get-employee-by-id.thunk"
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
import { EmployeeDetailsForm } from "@/Employees/ui/employee-details-form/employee-details-form"
import { DetailsWrapper } from "@/components/details-wrapper/details-wrapper"
import { createEmployeeThunk } from "@/Employees/model/thunks/create-employee.thunk"
import { updateEmployeeThunk } from "@/Employees/model/thunks/update-employee.thunk"

export interface EmployeeDetailsProps {
  employeeId?: string
}

export const EmployeeDetails = memo((props: EmployeeDetailsProps) => {
  const { employeeId } = props

  const dispatch = useAppDispatch()
  const data = useAppSelector(getEmployeeDetailsData)
  const formData = useAppSelector(getEmployeeDetailsFormData)
  const error = useAppSelector(getEmployeeDetailsError)

  // const [editSheetIsOpen, setEditSheetIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (employeeId) dispatch(getEmployeeByIdThunk({ employeeId: employeeId }))
  }, [dispatch, employeeId])

  const onSubmit = useCallback(async () => {
    if (formData) {
      if (!auth?.activeWorkspace?.id) {
        toast.error(JSON.stringify("Не удалось определить workspaceId"))
        return false
      }

      try {
        if (!employeeId) {
          const result = await dispatch(
            createEmployeeThunk({
              entityData: formData,
              workspaceId: auth.activeWorkspace.id,
            })
          ).unwrap()

          if (result.isOk) {
            toast.success("Новый сотрудник добавлен", {
              position: "top-center",
              style: {
                color: "green",
              },
            })
            setIsEdit(false)
          }
        } else {
          const result = await dispatch(
            updateEmployeeThunk({
              entityData: formData,
              workspaceId: auth?.activeWorkspace.id,
            })
          ).unwrap()

          if (result.isOk) {
            toast.success("Изменения сохранены", {
              position: "top-center",
              style: {
                color: "green",
              },
            })
            setIsEdit(false)
          }
        }
      } catch (error) {
        toast.error((error as string) ?? "Ошибка", {
          position: "top-center",
          style: { color: "tomato" },
        })
      }
    }
  }, [auth.activeWorkspace?.id, dispatch, employeeId, formData])

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
      <DetailsWrapper
        error={error}
        isEdit={isEdit}
        onEditClick={() => setIsEdit(true)}
        onSaveClick={onSubmit}
        onBackClick={() => {
          if (isEdit) {
            setIsEdit(false)
          } else {
            router.back()
          }
        }}
        deleteMessage={`Вы действительно хотите удалить "${EmployeeHelper.getFullName(data)}"`}
        onDeleteClick={onDeleteCallback}
      >
        {isEdit ? (
          <EmployeeDetailsForm />
        ) : (
          <div
            className={"flex w-full flex-col items-start justify-start gap-3"}
          >
            <div
              className={
                "flex w-full flex-row items-center justify-center gap-4"
              }
            >
              <Avatar style={{ width: 100, height: 100 }} />
              <div
                className={
                  "flex w-full flex-col items-start justify-center gap-1"
                }
              >
                <div style={{ fontSize: 26, fontWeight: "bold" }}>
                  {data?.surname}
                </div>
                <div style={{ fontSize: 18 }}>
                  {EmployeeHelper.getNameAndPatronymic(data)}
                </div>
                <div
                  className={"flex flex-row items-center justify-center gap-2"}
                >
                  {data?.workspace?.company?.id && (
                    <div
                      className={"rounded-lg bg-muted p-1 text-sm font-light"}
                    >
                      {data?.workspace?.company.name}
                    </div>
                  )}
                  {data?.berth?.id && (
                    <div
                      className={"rounded-lg bg-muted p-1 text-sm font-light"}
                    >
                      {data?.berth?.name}
                    </div>
                  )}
                </div>
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
                  {data?.snils}
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
                  {dayjs(data?.hireDate).format("DD.MM.YYYY")}
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
                  {dayjs(data?.firedDate).format("DD.MM.YYYY")}
                </ItemContent>
              </Item>
            )}
            {(data?.phoneNumber || data?.email) && (
              <Marker variant="border">
                <MarkerIcon>
                  <IconAddressBook />
                </MarkerIcon>
                <MarkerContent>Контакты</MarkerContent>
              </Marker>
            )}
            {data?.phoneNumber && (
              <Item variant={"muted"}>
                <ItemMedia variant={"icon"}>
                  <IconPhone />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription> {"Телефон"}</ItemDescription>
                  {data?.phoneNumber}
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
                  {data?.email}
                </ItemContent>
              </Item>
            )}
          </div>
        )}
      </DetailsWrapper>
    </DynamicModuleLoader>

    // ---------------------------------------------------------

    // return (
    //   <DynamicModuleLoader
    //     reducers={{ employeeDetailsSchema: employeeDetailsReducer }}
    //     removeAfterUnmount={true}
    //   >
    //     <div className={"flex w-full flex-col gap-4"}>
    //       <DetailsHeader
    //         // onEditClick={() => setEditSheetIsOpen(true)}
    //         onEditClick={() => setIsEdit(!isEdit)}
    //         onDeleteClick={onDeleteCallback}
    //         deleteMessage={`Вы действительно хотите удалить '${data?.surname}' со всеми связанными данными?`}
    //       >
    //         <EditEmployeeSheet
    //           isOpen={editSheetIsOpen}
    //           handleOpenChange={(e) => setEditSheetIsOpen(e)}
    //           employeeId={employeeId}
    //         />
    //       </DetailsHeader>
    //
    //     </div>
    //   </DynamicModuleLoader>
  )
})
