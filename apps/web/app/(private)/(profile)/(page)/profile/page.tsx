"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { useIsMobile } from "@workspace/ui/hooks/use-mobile"
import { EditProfileSheet } from "@/app/(private)/(profile)"
import { useUser } from "@/app/(auth)"

export default function ProfilePage() {
  const { user } = useUser()
  const isMobile = useIsMobile()
  return (
    <div className={"m-auto flex flex-col items-center justify-center gap-2"}>
      <Avatar className={"rounded-full"} style={{ width: 150, height: 150 }}>
        <AvatarImage src={undefined} alt={user?.email} />
        <AvatarFallback className="rounded-full">
          {" "}
          {user?.email?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <p>{user?.email}</p>
      <p>
        {user?.surname} {user?.name}
      </p>
      <p>{user?.phoneNumber}</p>
      <p>{isMobile ? "Мобильное устройство" : "Десктоп"}</p>
      <EditProfileSheet />
    </div>
  )
}
