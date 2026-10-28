"use client"

import React, { memo, useRef, useState } from "react"
import { Avatar } from "@workspace/ui/components/avatar"
import { useAuth } from "@/app/(public)/(auth)"
import { useRouter } from "next/navigation"
import { IconCalendar, IconId, IconMail, IconPhone } from "@tabler/icons-react"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
} from "@workspace/ui/components/item"
import dayjs from "dayjs"
import { DetailsWrapper } from "@/components/details-wrapper/details-wrapper"
import { formatSnils } from "@/Employees/ui/field-snils/field-snils"
import { formatPhoneNumberIntl } from "react-phone-number-input"
import { UserHelper } from "@/Users/helpers/user-helper"
import { ProfileDetailsForm } from "@/Users/ui/profile-details-form/profile-details-form"

export interface ProfileDetailsProps {}

export const ProfileDetails = memo((props: ProfileDetailsProps) => {
  const auth = useAuth()
  const router = useRouter()

  const [isEdit, setIsEdit] = useState(false)

  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <DetailsWrapper
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
      title={"Мой профиль"}
    >
      {isEdit ? (
        <ProfileDetailsForm
          onSubmit={() => {
            setIsEdit(false)
          }}
          submitRef={hiddenSubmitInputRef}
        />
      ) : (
        <div className={"flex w-full flex-col items-start justify-start gap-3"}>
          <div className={"flex w-full flex-row items-start justify-between"}>
            <div className={"flex flex-row items-center justify-center gap-4"}>
              <Avatar style={{ width: 100, height: 100 }} />
              <div
                className={
                  "flex w-full flex-col items-start justify-center gap-1"
                }
              >
                <div style={{ fontSize: 26, fontWeight: "bold" }}>
                  {auth?.user?.surname}
                </div>
                <div style={{ fontSize: 18 }}>
                  {UserHelper.getNameAndPatronymic(auth?.user)}
                </div>
              </div>
            </div>
            <div className={"flex flex-col items-end justify-center gap-2"}>
              {auth?.user?.phoneNumber && (
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
                    {formatPhoneNumberIntl(auth?.user?.phoneNumber)}
                  </div>
                </div>
              )}
              {auth?.user?.email && auth?.user.email.length > 0 && (
                <div
                  className={"flex flex-row items-center justify-center gap-1"}
                >
                  <IconMail
                    className={"size-4 fill-blue-200 stroke-blue-700"}
                    stroke={2}
                  />
                  <div className={"text-sm font-light"}>
                    {auth?.user?.email}
                  </div>
                </div>
              )}
            </div>
          </div>
          {auth?.user?.birthDate && (
            <Item variant={"muted"}>
              <ItemMedia variant={"icon"}>
                <IconCalendar />
              </ItemMedia>
              <ItemContent>
                <ItemDescription> {"Дата рождения"}</ItemDescription>
                {dayjs(auth?.user.birthDate).format("DD.MM.YYYY")}
              </ItemContent>
            </Item>
          )}
          {auth?.user?.snils && (
            <Item variant={"muted"}>
              <ItemMedia variant={"icon"}>
                <IconId />
              </ItemMedia>
              <ItemContent>
                <ItemDescription> {"СНИЛС"}</ItemDescription>
                {formatSnils(auth?.user?.snils)}
              </ItemContent>
            </Item>
          )}
        </div>
      )}
    </DetailsWrapper>
  )
})
