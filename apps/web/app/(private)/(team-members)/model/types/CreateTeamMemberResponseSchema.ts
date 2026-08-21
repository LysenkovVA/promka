import { TeamMemberSchema } from "@/TeamMember"
import { z } from "zod/v4"

export const CreateTeamMemberResponseSchema = TeamMemberSchema.extend({})

/**
 * Контракт на создание TeamMember
 */
export type CreateTeamMemberResponse = z.infer<
  typeof CreateTeamMemberResponseSchema
>
