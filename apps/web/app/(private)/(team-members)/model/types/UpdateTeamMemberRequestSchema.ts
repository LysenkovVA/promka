import { z } from "zod/v4"
import { TeamMemberSchema } from "./TeamMemberSchema"

export const UpdateTeamMemberRequestSchema = TeamMemberSchema.partial()

/**
 * Контракт на обновление WorkspacePermissions
 */
export type UpdateTeamMemberRequest = z.infer<
  typeof UpdateTeamMemberRequestSchema
>
