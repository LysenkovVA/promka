import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@workspace/ui/components/sidebar"
import { SidebarUser } from "@/components/AppSidebar/sidebar-user"
import { useAppSelector } from "@/lib/redux"
import { getAuthDataUser } from "@/app/(auth)/model/selectors/authSelectors"
import { AppCompanySwitcher } from "@/components/AppSidebar/app-company-switcher"
import { Dashboard } from "@/components/AppSidebar/content/dashboard/dashboard"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector(getAuthDataUser)

  return (
    // <Sidebar collapsible="offcanvas" {...props}>
    <Sidebar collapsible="icon" {...props}>
      {/*Заголовок сайдбара*/}
      <SidebarHeader className={"m-0 p-0"}>
        <AppCompanySwitcher user={user} />
      </SidebarHeader>
      {/*Контент сайдбара (scrollable-область между заголовком и подвалом сайдбара*/}
      <SidebarContent>
        <SidebarGroup>
          <Dashboard />
          {/*<SidebarMenuItem>*/}
          {/*  <SidebarMenuButton asChild isActive={path === ROUTE.EMPLOYEES.href}>*/}
          {/*    <Link href={ROUTE.EMPLOYEES.href}>*/}
          {/*      <UsersIcon className="size-5!" />*/}
          {/*      <span className="text-base">{ROUTE.EMPLOYEES.name}</span>*/}
          {/*    </Link>*/}
          {/*  </SidebarMenuButton>*/}
          {/*</SidebarMenuItem>*/}
        </SidebarGroup>
        {/*<SidebarGroup>*/}
        {/*  <SidebarGroupLabel>Проверки</SidebarGroupLabel>*/}
        {/*  <SidebarMenuItem>*/}
        {/*    <SidebarMenuButton*/}
        {/*      asChild*/}
        {/*      isActive={path === ROUTE.INSPECTIONS.href}*/}
        {/*    >*/}
        {/*      <Link href={ROUTE.INSPECTIONS.href}>*/}
        {/*        <IconCheckupList className="size-5!" />*/}
        {/*        <span className="text-base">{ROUTE.INSPECTIONS.name}</span>*/}
        {/*      </Link>*/}
        {/*    </SidebarMenuButton>*/}
        {/*  </SidebarMenuItem>*/}
        {/*  <SidebarMenuItem>*/}
        {/*    <SidebarMenuSub>*/}
        {/*      <SidebarMenuSubItem>*/}
        {/*        <span className="text-sm">{"Все"}</span>*/}
        {/*      </SidebarMenuSubItem>*/}
        {/*      <SidebarMenuSubItem>*/}
        {/*        <span className="text-sm">{"Пройденные"}</span>*/}
        {/*      </SidebarMenuSubItem>*/}
        {/*      <SidebarMenuSubItem>*/}
        {/*        <span className="text-sm">{"Есть нарушения"}</span>*/}
        {/*      </SidebarMenuSubItem>*/}
        {/*    </SidebarMenuSub>*/}
        {/*  </SidebarMenuItem>*/}
        {/*</SidebarGroup>*/}
        {/*<SidebarGroup>*/}
        {/*  <SidebarGroupLabel>Обучение</SidebarGroupLabel>*/}
        {/*  <SidebarMenuItem>*/}
        {/*    <SidebarMenuButton*/}
        {/*      asChild*/}
        {/*      isActive={path === ROUTE.CERTIFICATES.href}*/}
        {/*    >*/}
        {/*      <Link href={ROUTE.CERTIFICATES.href}>*/}
        {/*        <IconCertificate className="size-5!" />*/}
        {/*        <span className="text-base">{ROUTE.CERTIFICATES.name}</span>*/}
        {/*      </Link>*/}
        {/*    </SidebarMenuButton>*/}
        {/*    /!*<SidebarMenuAction>*!/*/}
        {/*    /!*  <Plus /> <span className="sr-only">Add</span>*!/*/}
        {/*    /!*</SidebarMenuAction>*!/*/}
        {/*  </SidebarMenuItem>*/}
        {/*  <SidebarMenuItem>*/}
        {/*    <SidebarMenuSub>*/}
        {/*      <SidebarMenuSubItem>*/}
        {/*        <span className="text-sm">{"Все"}</span>*/}
        {/*      </SidebarMenuSubItem>*/}
        {/*      <SidebarMenuSubItem>*/}
        {/*        <span className="text-sm">{"Скоро закончатся"}</span>*/}
        {/*        <SidebarMenuBadge className={"bg-red-400"}>24</SidebarMenuBadge>*/}
        {/*      </SidebarMenuSubItem>*/}
        {/*      <SidebarMenuSubItem>*/}
        {/*        <span className="text-sm">{"Просроченные"}</span>*/}
        {/*      </SidebarMenuSubItem>*/}
        {/*    </SidebarMenuSub>*/}
        {/*  </SidebarMenuItem>*/}
        {/*</SidebarGroup>*/}
        {/*<SidebarGroup>*/}
        {/*  /!*<SidebarGroupLabel*!/*/}
        {/*  /!*  className={"align-center m-auto flex w-full justify-between"}*!/*/}
        {/*  /!*>*!/*/}
        {/*  /!*  <div*!/*/}
        {/*  /!*    className={*!/*/}
        {/*  /!*      "flex w-fit flex-row items-center justify-center gap-1"*!/*/}
        {/*  /!*    }*!/*/}
        {/*  /!*  >*!/*/}
        {/*  /!*    <IconCrane className={"size-3"} stroke={2} />*!/*/}
        {/*  /!*    <div>Объекты</div>*!/*/}
        {/*  /!*  </div>*!/*/}
        {/*  /!*</SidebarGroupLabel>*!/*/}
        {/*  <SidebarGroupLabel>{"Объекты"}</SidebarGroupLabel>*/}
        {/*  /!*<ObjectAddSidebarButton />*!/*/}
        {/*  <SidebarGroupAction asChild>*/}
        {/*    /!*<Button variant={"outline"}>{"Action"}</Button>*!/*/}
        {/*    <ObjectAddSidebarButton />*/}
        {/*  </SidebarGroupAction>*/}
        {/*</SidebarGroup>*/}
      </SidebarContent>
      {/*Подвал сайдбара*/}
      <SidebarFooter>
        <SidebarUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
