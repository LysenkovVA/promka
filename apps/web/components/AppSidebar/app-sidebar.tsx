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
import { LayoutDashboardIcon } from "lucide-react"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
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
            <a href="/dashboard">
              <LayoutDashboardIcon className="size-5!" />
              <span className="text-base">Dashboard</span>
            </a>
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
      <SidebarFooter />
    </Sidebar>
  )
}
