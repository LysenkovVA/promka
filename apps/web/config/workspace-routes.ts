/**
 * Страницы приложения, относящиеся к конкретному Workspace
 */
export type WORKSPACE_ROUTE_TYPE = "DASHBOARD" | "EMPLOYEES"

export const WORKSPACE_ROUTE: Record<
  WORKSPACE_ROUTE_TYPE,
  { href: string; name: string }
> = {
  DASHBOARD: { href: "/dashboard", name: "Главное" },
  EMPLOYEES: { href: "/employees", name: "Сотрудники" },
}
