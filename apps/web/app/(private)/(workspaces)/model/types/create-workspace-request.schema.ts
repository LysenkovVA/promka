import { z } from "zod/v4"
import { WorkspaceSchema } from "./workspace.schema"

export const CreateWorkspaceRequestSchema = WorkspaceSchema.omit({
  id: true,
})

export type CreateWorkspaceRequest = z.infer<
  typeof CreateWorkspaceRequestSchema
>
