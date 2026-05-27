"use client"

import { IUserEntity } from "@/app/(private)/(users)"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"
import Link from "next/link"
import { ROUTE } from "@/config/routes"
import { useAppDispatch } from "@/lib/redux"
import { logoutThunk } from "@/app/(auth)/model/thunks/logoutThunk"

export interface ServerSideProps {
  user: IUserEntity | undefined
}

export function SidebarUser(props: ServerSideProps) {
  const { isMobile } = useSidebar()

  const { user } = props

  const dispatch = useAppDispatch()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={""} alt={user?.email} />
                <AvatarFallback className="rounded-lg">
                  {" "}
                  {user?.email?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.email}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={""} alt={user?.email} />
                  <AvatarFallback className="rounded-lg">
                    {user?.email?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.email}</span>
                  {/*<span className="truncate text-xs text-muted-foreground">*/}
                  {/*  {user.email}*/}
                  {/*</span>*/}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={ROUTE.PROFILE.href}>
                  <IconUserCircle />
                  {ROUTE.PROFILE.name}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <IconCreditCard />
                Платежи
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <IconNotification />
                Уведомления
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                // await logout()
                await dispatch(logoutThunk())
              }}
            >
              <IconLogout />
              Выход
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
