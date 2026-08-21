import { z } from "zod/v4"
import { WorkspaceSchema } from "./WorkspaceSchema"

export const CreateWorkspaceSchema = WorkspaceSchema.omit({
  id: true,
})

/**
 * Контракт на создание TeamMember
 */
export type CreateWorkspace = z.infer<typeof CreateWorkspaceSchema>
