import { z } from "zod/v4"
import { TeamMemberSchema } from "./TeamMemberSchema"

export const UpdateTeamMemberResponseSchema = TeamMemberSchema.partial()

/**
 * Контракт на обновление WorkspacePermissions
 */
export type UpdateTeamMemberResponse = z.infer<
  typeof UpdateTeamMemberResponseSchema
>
