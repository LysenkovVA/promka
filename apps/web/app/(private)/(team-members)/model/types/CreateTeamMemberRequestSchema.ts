import { z } from "zod/v4"
import { TeamMemberSchema } from "./TeamMemberSchema"

export const CreateTeamMemberRequestSchema = TeamMemberSchema.omit({
  id: true,
})

/**
 * Контракт на создание TeamMember
 */
export type CreateTeamMemberRequest = z.infer<
  typeof CreateTeamMemberRequestSchema
>
