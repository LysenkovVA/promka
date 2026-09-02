import { z } from "zod/v4"
import { WorkspaceSchema } from "./workspace.schema"

export const UpdateWorkspaceResponseSchema = WorkspaceSchema.partial()

export type UpdateWorkspaceResponse = z.infer<
  typeof UpdateWorkspaceResponseSchema
>
