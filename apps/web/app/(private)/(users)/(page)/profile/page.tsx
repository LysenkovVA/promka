"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { IconMail, IconPhone } from "@tabler/icons-react"
import { Separator } from "@workspace/ui/components/separator"
import { useAuth } from "@/app/(public)/(auth)"

export default function ProfilePage() {
  const { user } = useAuth()
  // const isMobile = useIsMobile()
  return (
    <div className={"m-auto flex flex-col items-center justify-center gap-3"}>
      <div
        className={
          "m-auto flex w-full flex-row items-center justify-start gap-4"
        }
      >
        <Avatar className={"rounded-full"} style={{ width: 150, height: 150 }}>
          <AvatarImage src={undefined} alt={user?.email} />
          <AvatarFallback className="rounded-full">
            {user?.email?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div
          className={
            "m-auto flex w-full flex-col items-start justify-start gap-2"
          }
        >
          <p className={"text-2xl"}>
            {user?.surname} {user?.name}
          </p>
          <Separator />
          <div className={"mt-2 flex items-center justify-center gap-2"}>
            <IconMail stroke={2} className={"size-5 text-gray-400"} />
            <p className={"text-sm text-gray-400"}>{user?.email}</p>
          </div>
          <div className={"flex items-center justify-center gap-2"}>
            <IconPhone stroke={2} className={"size-5 text-gray-400"} />
            <p className={"text-sm text-gray-400"}>{user?.phoneNumber}</p>
          </div>
        </div>
      </div>
      {/*<EditProfileSheet />*/}
    </div>
  )
}
