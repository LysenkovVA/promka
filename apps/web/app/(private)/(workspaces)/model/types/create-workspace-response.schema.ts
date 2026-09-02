import { z } from "zod/v4"
import { WorkspaceSchema } from "./workspace.schema"

export const CreateWorkspaceResponseSchema = WorkspaceSchema.extend({})

/**
 * Контракт на создание TeamMember
 */
export type CreateWorkspaceResponse = z.infer<
  typeof CreateWorkspaceResponseSchema
>
