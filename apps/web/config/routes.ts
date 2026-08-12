/**
 * Страницы приложения, не относящиеся к Workspace
 */
export type APP_ROUTE = "DASHBOARD" | "PROFILE"

export const ROUTE: Record<APP_ROUTE, { href: string; name: string }> = {
  DASHBOARD: { href: "/dashboard", name: "Главное" },
  PROFILE: { href: "/profile", name: "Мой профиль" },
}
