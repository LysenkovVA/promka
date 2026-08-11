/**
 * Страницы приложения
 */
export type APP_ROUTE =
  | "DASHBOARD"
  | "INSPECTIONS"
  | "EMPLOYEES"
  | "PROFILE"
  | "CERTIFICATES"
  | "OBJECTS"

export const ROUTE: Record<APP_ROUTE, { href: string; name: string }> = {
  DASHBOARD: { href: "/dashboard", name: "Главное" },
  INSPECTIONS: { href: "/inspections", name: "Проверки" },
  EMPLOYEES: { href: "/employees", name: "Сотрудники" },
  PROFILE: { href: "/profile", name: "Мой профиль" },
  CERTIFICATES: { href: "/certificates", name: "Удостоверения" },
  OBJECTS: { href: "/objects", name: "Объекты" },
}
