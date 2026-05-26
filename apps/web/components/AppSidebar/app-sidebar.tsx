import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { LayoutDashboardIcon, UsersIcon } from "lucide-react"
import { HEADER_HEIGHT } from "@/config/app"
import Link from "next/link"
import { SidebarUser } from "@/components/AppSidebar/sidebar-user"
import { useAppSelector } from "@/lib/redux"
import { getAuthDataUser } from "@/app/(auth)/model/selectors/authSelectors"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector(getAuthDataUser)

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader style={{ margin: 0, padding: 0 }}>
        <SidebarMenu
          style={{
            background: "red",
            height: HEADER_HEIGHT,
          }}
        >
          {"Sidebar menu here"}
          {/*<SidebarMenuItem>*/}
          {/*  <DropdownMenu>*/}
          {/*    <DropdownMenuTrigger asChild>*/}
          {/*      <SidebarMenuButton>*/}
          {/*        /!*Выберите организацию*!/*/}
          {/*        <EllipsisVertical className="ml-auto" />*/}
          {/*      </SidebarMenuButton>*/}
          {/*    </DropdownMenuTrigger>*/}
          {/*    <DropdownMenuContent className="w-[--radix-popper-anchor-width]">*/}
          {/*      <DropdownMenuItem>*/}
          {/*        <span>Acme Inc</span>*/}
          {/*      </DropdownMenuItem>*/}
          {/*    </DropdownMenuContent>*/}
          {/*  </DropdownMenu>*/}
          {/*</SidebarMenuItem>*/}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupLabel>Модули</SidebarGroupLabel>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/dashboard">
              <LayoutDashboardIcon className="size-5!" />
              <span className="text-base">Информация</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <Link href="/employees">
              <UsersIcon className="size-5!" />
              <span className="text-base">Работники</span>
            </Link>
          </SidebarMenuButton>
          {/*<SidebarMenuAction>*/}
          {/*  <Plus /> <span className="sr-only">Add Project</span>*/}
          {/*</SidebarMenuAction>*/}
        </SidebarMenuItem>
        {/*<SidebarGroup>*/}
        {/*  <SidebarGroupLabel>Application</SidebarGroupLabel>*/}
        {/*  <SidebarGroupAction>*/}
        {/*    <Plus /> <span className="sr-only">Add Project</span>*/}
        {/*  </SidebarGroupAction>*/}
        {/*  <SidebarGroupContent></SidebarGroupContent>*/}
        {/*</SidebarGroup>*/}
        {/*<SidebarGroup />*/}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
