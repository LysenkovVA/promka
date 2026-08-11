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
} from "@/app/(auth)/model/selectors/authSelectors"
import { AppCompanySwitcher } from "@/components/AppSidebar/app-company-switcher"
import { Dashboard } from "@/components/AppSidebar/content/dashboard/dashboard"
import { Employees } from "@/components/AppSidebar/content/employees/employees"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector(getAuthDataUser)

  const authData = useAppSelector(getAuthData)

  return (
    // <Sidebar collapsible="offcanvas" {...props}>
    <Sidebar collapsible="icon" {...props}>
      {/*Заголовок сайдбара*/}
      <SidebarHeader className={"m-0 p-0"}>
        <AppCompanySwitcher user={user} />
      </SidebarHeader>
      {/*Контент сайдбара (scrollable-область между заголовком и подвалом сайдбара*/}
      <SidebarContent>
        <Dashboard />
        {authData?.activeCompany && <Employees />}
      </SidebarContent>
      {/*Подвал сайдбара*/}
      <SidebarFooter>
        <SidebarUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
