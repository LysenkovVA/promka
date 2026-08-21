import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
  ZOD_VALUE_REQUIRED,
} from "@/lib/zod/commonErrors"

/**
 * Схема валидации WorkspacePermissionsSchema
 */
export const WorkspacePermissionsSchema = z.object(
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
    canRead: z.boolean().default(true),
    canWrite: z.boolean().default(true),
    canDelete: z.boolean().default(true),
    teamMember:
      // Для устранения ошибок с циклическими зависимостями
      z
        .lazy(() => {
          const { TeamMemberSchema } = require("@/TeamMember")
          return TeamMemberSchema
        })
        .nonoptional({
          error: (issue) => {
            switch (issue.code) {
              case "invalid_type":
                return "Поле 'teamMember' является обязательным"
            }
          },
        }),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined ? ZOD_VALUE_REQUIRED : ZOD_INVALID_OBJECT_TYPE,
  }
)
