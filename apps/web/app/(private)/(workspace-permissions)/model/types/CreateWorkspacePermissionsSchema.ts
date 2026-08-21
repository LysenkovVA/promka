import { WorkspacePermissionsSchema } from "@/WorkspacePermissions"
import { z } from "zod/v4"

export const CreateWorkspacePermissionsSchema = WorkspacePermissionsSchema.omit(
  {
    id: true,
  }
)

/**
 * Контракт на создание WorkspacePermissions
 */
export type CreateWorkspacePermissions = z.infer<
  typeof CreateWorkspacePermissionsSchema
>
