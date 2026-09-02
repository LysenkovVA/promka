import { z } from "zod/v4"
import { WorkspaceSchema } from "./workspace.schema"

export const UpdateWorkspaceRequestSchema = WorkspaceSchema.partial()

export type UpdateWorkspaceRequest = z.infer<
  typeof UpdateWorkspaceRequestSchema
>
