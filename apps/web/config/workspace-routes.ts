/**
 * Шаблоны маршрутов для workspace. :workspaceId заменяется на реальный ID.
 */
type WorkspaceRouteKey =
  | "DASHBOARD"
  | "EMPLOYEES"
  | "CERTIFICATES"
  | "PROTOCOLS"

const WORKSPACE_ROUTE_TEMPLATES: Record<
  WorkspaceRouteKey,
  { template: string; name: string }
> = {
  DASHBOARD: { template: "/workspaces/:workspaceId", name: "Главное" },
  EMPLOYEES: {
    template: "/workspaces/:workspaceId/employees",
    name: "Сотрудники",
  },
  CERTIFICATES: {
    template: "/workspaces/:workspaceId/certificates",
    name: "Удостоверения",
  },
  PROTOCOLS: {
    template: "/workspaces/:workspaceId/protocols",
    name: "Протоколы",
  },
}

/**
 * Генерирует маршруты для конкретного workspace, подставляя ID в шаблоны.
 *
 * @example
 * ```ts
 * const routes = generateWorkspaceRoutes("clxxx123")
 * routes.DASHBOARD.href // "/workspaces/clxxx123"
 * routes.EMPLOYEES.href // "/workspaces/clxxx123/employees"
 * ```
 */
export function generateWorkspaceRoutes(workspaceId: string) {
  return Object.fromEntries(
    Object.entries(WORKSPACE_ROUTE_TEMPLATES).map(
      ([key, { template, name }]) => [
        key,
        {
          href: template.replace(":workspaceId", workspaceId),
          name,
        },
      ]
    )
  ) as Record<WorkspaceRouteKey, { href: string; name: string }>
}
