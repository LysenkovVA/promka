import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
  ZOD_VALUE_REQUIRED,
} from "@/lib/zod/commonErrors"
import { TeamMemberSchema } from "@/TeamMember"
import { CompanySchema } from "@/Companies"

/**
 * Схема валидации WorkspaceSchema
 */
export const WorkspaceSchema = z.object(
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
    company:
      // Для устранения ошибок с циклическими зависимостями
      z
        .lazy<typeof CompanySchema>(() => {
          const { CompanySchema } = require("@/Companies")
          return CompanySchema
        })
        .nonoptional({
          error: (issue) => {
            switch (issue.code) {
              case "invalid_type":
                return "Поле 'company' является обязательным"
            }
          },
        }),
    teamMembers: z
      .array(
        // Для устранения ошибок с циклическими зависимостями
        z
          .lazy(() => {
            const { TeamMemberSchema } = require("@/TeamMember")
            return TeamMemberSchema
          })
          .optional(),
        {
          error: (issue) => {
            switch (issue.code) {
              case "invalid_type":
                return ZOD_INVALID_OBJECT_TYPE
            }
          },
        }
      )
      .nullish(),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined ? ZOD_VALUE_REQUIRED : ZOD_INVALID_OBJECT_TYPE,
  }
)

export type Workspace = z.infer<typeof WorkspaceSchema>
