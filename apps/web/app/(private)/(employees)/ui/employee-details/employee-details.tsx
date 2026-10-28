"use client"

import React, { memo, useCallback, useEffect, useRef, useState } from "react"
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
  getEmployeeDetailsIsFetching,
  getEmployeeDetailsIsInitialized,
} from "../../model/selectors/employee-details.selectors"
import { deleteEmployeeThunk } from "../../model/thunks/delete-employee.thunk"
import { useAuth } from "@/app/(public)/(auth)"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { EmployeeHelper } from "@/Employees/helpers/employee-helper"
import { IconCalendar, IconId, IconMail, IconPhone } from "@tabler/icons-react"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
} from "@workspace/ui/components/item"
import dayjs from "dayjs"
import { EmployeeDetailsForm } from "@/Employees/ui/employee-details-form/employee-details-form"
import { DetailsWrapper } from "@/components/details-wrapper/details-wrapper"
import { getEmployeeByIdThunk } from "@/Employees/model/thunks/get-employee-by-id.thunk"
import { formatSnils } from "@/Employees/ui/field-snils/field-snils"
import { formatPhoneNumberIntl } from "react-phone-number-input"
import { FieldDescription } from "@workspace/ui/components/field"
import { Separator } from "@workspace/ui/components/separator"
import { CertificateCard } from "@/Certificates/ui/certificate-card/certificate-card"

export interface EmployeeDetailsProps {
  employeeId?: string
}

export const EmployeeDetails = memo((props: EmployeeDetailsProps) => {
  const { employeeId } = props

  const [isEdit, setIsEdit] = useState(false)

  const dispatch = useAppDispatch()
  const data = useAppSelector(getEmployeeDetailsData)
  const error = useAppSelector(getEmployeeDetailsError)
  const isInitialized = useAppSelector(getEmployeeDetailsIsInitialized)
  const isLoading = useAppSelector(getEmployeeDetailsIsFetching)

  const auth = useAuth()
  const router = useRouter()

  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (employeeId && !isInitialized && !isLoading) {
      dispatch(getEmployeeByIdThunk({ employeeId: employeeId }))
    }
  }, [dispatch, employeeId, isInitialized, isLoading])

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
        onSaveClick={() => {
          hiddenSubmitInputRef.current?.click()
        }}
        onBackClick={() => {
          if (isEdit) {
            setIsEdit(false)
          } else {
            router.back()
          }
        }}
        deleteMessage={`Вы действительно хотите удалить "${EmployeeHelper.getFullName(data)}"`}
        onDeleteClick={onDeleteCallback}
        title={"Сотрудник"}
      >
        {isEdit ? (
          <EmployeeDetailsForm
            onSubmit={() => {
              setIsEdit(false)
            }}
            submitRef={hiddenSubmitInputRef}
            employeeId={employeeId}
          />
        ) : (
          <div
            className={"flex w-full flex-col items-start justify-start gap-3"}
          >
            <div className={"flex w-full flex-row items-start justify-between"}>
              <div
                className={"flex flex-row items-center justify-center gap-4"}
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
                    className={
                      "flex flex-row items-center justify-center gap-2"
                    }
                  >
                    {auth.activeWorkspace?.company?.id && (
                      <div
                        className={"rounded-lg bg-muted p-1 text-sm font-light"}
                      >
                        {auth.activeWorkspace?.company.name}
                      </div>
                    )}
                    {data?.berth?.id && (
                      <div
                        className={"rounded-lg bg-muted p-1 text-sm font-light"}
                      >
                        {data?.berth?.name}
                      </div>
                    )}
                    {data?.department?.id && (
                      <div
                        className={"rounded-lg bg-muted p-1 text-sm font-light"}
                      >
                        {data?.department?.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={"flex flex-col items-end justify-center gap-2"}>
                {data?.phoneNumber && (
                  <div
                    className={
                      "line-clamp-1 flex flex-row items-center justify-center gap-1"
                    }
                  >
                    <IconPhone
                      className={"size-4 fill-green-300 stroke-green-700"}
                      stroke={2}
                    />
                    <div className={"text-sm font-light"}>
                      {formatPhoneNumberIntl(data?.phoneNumber)}
                    </div>
                  </div>
                )}
                {data?.email && data.email.length > 0 && (
                  <div
                    className={
                      "flex flex-row items-center justify-center gap-1"
                    }
                  >
                    <IconMail
                      className={"size-4 fill-blue-200 stroke-blue-700"}
                      stroke={2}
                    />
                    <div className={"text-sm font-light"}>{data?.email}</div>
                  </div>
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
                  {formatSnils(data?.snils)}
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
            {/*{(data?.phoneNumber || data?.email) && (*/}
            {/*  <Marker variant="border">*/}
            {/*    <MarkerIcon>*/}
            {/*      <IconAddressBook />*/}
            {/*    </MarkerIcon>*/}
            {/*    <MarkerContent>Контакты</MarkerContent>*/}
            {/*  </Marker>*/}
            {/*)}*/}
            {/*{data?.phoneNumber && (*/}
            {/*  <Item variant={"muted"}>*/}
            {/*    <ItemMedia variant={"icon"}>*/}
            {/*      <IconPhone />*/}
            {/*    </ItemMedia>*/}
            {/*    <ItemContent>*/}
            {/*      <ItemDescription> {"Телефон"}</ItemDescription>*/}
            {/*      {data?.phoneNumber}*/}
            {/*    </ItemContent>*/}
            {/*  </Item>*/}
            {/*)}*/}
            {/*{data?.email && (*/}
            {/*  <Item variant={"muted"}>*/}
            {/*    <ItemMedia variant={"icon"}>*/}
            {/*      <IconMail />*/}
            {/*    </ItemMedia>*/}
            {/*    <ItemContent>*/}
            {/*      <ItemDescription> {"E-mail"}</ItemDescription>*/}
            {/*      {data?.email}*/}
            {/*    </ItemContent>*/}
            {/*  </Item>*/}
            {/*)}*/}
            {data?.id && data.certificates && data.certificates.length > 0 && (
              <>
                <FieldDescription className={"mt-4"}>
                  {"Удостоверения"}
                </FieldDescription>
                <Separator />
                <div className={"grid w-full grid-cols-3 gap-2"}>
                  {!data.certificates && <div>{"Удостоверений нет"}</div>}
                  {data.certificates?.map((item) => (
                    <CertificateCard
                      key={item.id}
                      certificate={item}
                      hideEmployee={true}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </DetailsWrapper>
    </DynamicModuleLoader>
  )
})
