/**
 * Страницы приложения
 */
export type APP_ROUTE = "DASHBOARD" | "EMPLOYEES" | "PROFILE"

export const ROUTE: Record<APP_ROUTE, { href: string; name: string }> = {
  DASHBOARD: { href: "/dashboard", name: "Информация" },
  EMPLOYEES: { href: "/employees", name: "Сотрудники" },
  PROFILE: { href: "/profile", name: "Профиль" },
}
