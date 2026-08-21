import { z } from "zod/v4"
import { WorkspaceSchema } from "./WorkspaceSchema"

export const UpdateWorkspaceSchema = WorkspaceSchema.partial()

/**
 * Контракт на обновление WorkspacePermissions
 */
export type UpdateWorkspace = z.infer<typeof UpdateWorkspaceSchema>