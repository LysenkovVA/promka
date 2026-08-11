"use client"

import { memo, useState } from "react"
import { IUserEntity } from "@/app/(private)/(users)"
import { SidebarMenu, useSidebar } from "@workspace/ui/components/sidebar"
import Image from "next/image"
import { HEADER_HEIGHT } from "@/config/app"
import { ICompanyEntity } from "@/app/(private)/(companies)/model/types/ICompanyEntity"

export interface AppCompanySwitcherProps {
  user?: IUserEntity
}

export const AppCompanySwitcher = memo((props: AppCompanySwitcherProps) => {
  const { user } = props

  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = useState<ICompanyEntity | undefined>(
    undefined
  )

  const { state } = useSidebar()

  // useEffect(() => {
  //   const activeCompanyId = localStorage.getItem("activeCompanyId")
  //
  //   if (!activeCompanyId && user?.companies?.[0]?.id) {
  //     setActiveTeam(user?.companies?.[0])
  //     localStorage.setItem("activeCompanyId", user?.companies?.[0]?.id)
  //   } else {
  //     setActiveTeam(
  //       user?.companies?.find((company) => company.id! === activeCompanyId)
  //     )
  //   }
  // }, [])
  //
  // if (!activeTeam) {
  //   return <div>No companies found</div>
  // }

  return (
    <SidebarMenu
      className={
        "flex flex-row items-center justify-center gap-2 rounded-lg bg-gray-400 p-1"
      }
    >
      <div
        className={`flex h-10 w-full flex-row items-center ${state === "expanded" ? "justify-start" : "justify-center"} gap-1`}
      >
        <Image
          src="/logo.png" // Убедитесь, что файл находится в public/logo.png
          alt="Логотип"
          loading={"eager"}
          width={HEADER_HEIGHT * 0.6}
          height={HEADER_HEIGHT * 0.6}
          style={{ objectFit: "contain", opacity: 0.8 }}
        />
        {state === "expanded" && (
          <span className="text-md truncate font-light">Промка</span>
        )}
      </div>
      {/*<SidebarMenuItem className="flex-1">*/}
      {/*  <DropdownMenu>*/}
      {/*    <DropdownMenuTrigger className="h-full" asChild>*/}
      {/*      <SidebarMenuButton*/}
      {/*        size="lg"*/}
      {/*        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"*/}
      {/*      >*/}
      {/*        <div className="grid flex-1 text-left">*/}
      {/*          <span className={"text-xs font-light"}>{activeTeam.name}</span>*/}
      {/*        </div>*/}
      {/*        <ChevronsUpDown className="ml-auto" />*/}
      {/*      </SidebarMenuButton>*/}
      {/*    </DropdownMenuTrigger>*/}
      {/*    <DropdownMenuContent*/}
      {/*      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"*/}
      {/*      align="start"*/}
      {/*      side={isMobile ? "bottom" : "right"}*/}
      {/*      sideOffset={4}*/}
      {/*    >*/}
      {/*      <DropdownMenuLabel className="text-xs text-muted-foreground">*/}
      {/*        Мои организации*/}
      {/*      </DropdownMenuLabel>*/}
      {/*      {user?.companies?.map((team, index) => (*/}
      {/*        <DropdownMenuItem*/}
      {/*          key={team.name}*/}
      {/*          onClick={() => {*/}
      {/*            setActiveTeam(team)*/}
      {/*            localStorage.setItem("activeCompanyId", team.id!)*/}
      {/*          }}*/}
      {/*          className="gap-2 p-2"*/}
      {/*        >*/}
      {/*          /!*<div className="flex size-6 items-center justify-center rounded-md border">*!/*/}
      {/*          /!*  <team.logo className="size-3.5 shrink-0" />*!/*/}
      {/*          /!*</div>*!/*/}
      {/*          {team.name}*/}
      {/*          /!*<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>*!/*/}
      {/*        </DropdownMenuItem>*/}
      {/*      ))}*/}
      {/*      <DropdownMenuSeparator />*/}
      {/*      <DropdownMenuItem*/}
      {/*        className="gap-2 p-2"*/}
      {/*        onClick={() => {*/}
      {/*          // setSheetIsOpen(true)*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        <div>Добавить организацию</div>*/}
      {/*      </DropdownMenuItem>*/}
      {/*    </DropdownMenuContent>*/}
      {/*  </DropdownMenu>*/}
      {/*</SidebarMenuItem>*/}
    </SidebarMenu>
  )
})
