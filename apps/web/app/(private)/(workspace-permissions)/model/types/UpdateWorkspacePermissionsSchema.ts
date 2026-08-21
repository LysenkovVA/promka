import { WorkspacePermissionsSchema } from "@/WorkspacePermissions"
import { z } from "zod/v4"

export const UpdateWorkspacePermissionsSchema =
  WorkspacePermissionsSchema.partial()

/**
 * Контракт на обновление WorkspacePermissions
 */
export type UpdateWorkspacePermissions = z.infer<
  typeof UpdateWorkspacePermissionsSchema
>
