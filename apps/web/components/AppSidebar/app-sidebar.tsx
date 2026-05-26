import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { LayoutDashboardIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { SidebarUser } from "@/components/AppSidebar/sidebar-user"
import { useAppSelector } from "@/lib/redux"
import { getAuthDataUser } from "@/app/(auth)/model/selectors/authSelectors"
import { CompanySelector } from "@/app/(private)/(companies)"
import { ROUTE } from "@/config/routes"
import { usePathname } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector(getAuthDataUser)

  const path = usePathname()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader style={{ margin: 0, padding: 0 }}>
        <SidebarMenu
          style={
            {
              // height: HEADER_HEIGHT,
              // border: "1px solid black",
            }
          }
        >
          <CompanySelector companies={undefined} />
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
        {/*<SidebarGroupLabel>Модули</SidebarGroupLabel>*/}
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={path === ROUTE.DASHBOARD.href}>
            <Link href={ROUTE.DASHBOARD.href}>
              <LayoutDashboardIcon className="size-5!" />
              <span className="text-base">{ROUTE.DASHBOARD.name}</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild isActive={path === ROUTE.EMPLOYEES.href}>
            <Link href={ROUTE.EMPLOYEES.href}>
              <UsersIcon className="size-5!" />
              <span className="text-base">{ROUTE.EMPLOYEES.name}</span>
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
