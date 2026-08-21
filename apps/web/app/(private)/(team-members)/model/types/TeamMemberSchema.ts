import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
  ZOD_VALUE_REQUIRED,
} from "@/lib/zod/commonErrors"
import { TeamMemberRole } from "@workspace/database/prisma/.generated/enums"

/**
 * Схема валидации TeamMemberSchema
 */
export const TeamMemberSchema = z.object(
  {
    id: z
      .cuid2({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
            case "invalid_format":
              return ZOD_INVALID_CUID_FORMAT(issue.input)
          }
        },
      })
      .nullish(),
    teamMemberRole: z
      .enum([TeamMemberRole.MEMBER, TeamMemberRole.ADMIN])
      .default("MEMBER"),
    user:
      // Для устранения ошибок с циклическими зависимостями
      z
        .lazy(() => {
          const { UserSchema } = require("@/Users")
          return UserSchema
        })
        .optional(),
    workspace:
      // Для устранения ошибок с циклическими зависимостями
      z
        .lazy(() => {
          const { WorkspaceSchema } = require("@/Workspaces")
          return WorkspaceSchema
        })
        .optional(),
    workspacePermissions:
      // Для устранения ошибок с циклическими зависимостями
      z
        .lazy(() => {
          const {
            WorkspacePermissionsSchema,
          } = require("@/WorkspacePermissions")
          return WorkspacePermissionsSchema
        })
        .optional(),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined ? ZOD_VALUE_REQUIRED : ZOD_INVALID_OBJECT_TYPE,
  }
)

export type TeamMember = z.infer<typeof TeamMemberSchema>
