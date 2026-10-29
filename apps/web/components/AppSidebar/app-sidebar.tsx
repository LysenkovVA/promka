import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@workspace/ui/components/sidebar"
import { SidebarUser } from "@/components/AppSidebar/sidebar-user"
import { useAppSelector } from "@/lib/redux"
import {
  getAuthData,
  getAuthDataUser,
} from "@/app/(public)/(auth)/model/selectors/authSelectors"
import { AppCompanySwitcher } from "@/components/AppSidebar/app-company-switcher"
import { SidebarMainLinks } from "@/components/AppSidebar/content/sidebar-main-links/sidebar-main-links"
import { SidebarWorkspaceLinks } from "@/components/AppSidebar/content/sidebar-workspace-links/sidebar-workspace-links"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector(getAuthDataUser)

  const authData = useAppSelector(getAuthData)

  return (
    // <Sidebar collapsible="offcanvas" {...props}>
    <Sidebar collapsible="icon" {...props}>
      {/*Заголовок сайдбара*/}
      <SidebarHeader className={"m-0 p-0"}>
        <AppCompanySwitcher />
      </SidebarHeader>
      {/*Контент сайдбара (scrollable-область между заголовком и подвалом сайдбара*/}
      <SidebarContent>
        <SidebarMainLinks />
        {authData?.activeWorkspaceId && <SidebarWorkspaceLinks />}
      </SidebarContent>
      {/*Подвал сайдбара*/}
      <SidebarFooter>
        <SidebarUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
