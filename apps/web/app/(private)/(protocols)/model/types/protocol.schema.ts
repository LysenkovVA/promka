import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_DATETIME_TYPE,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
} from "@/lib/zod/commonErrors"
import { stripTimezone } from "@/lib/date/utils"
import { WorkspaceSchema } from "@/Workspaces"

export const ProtocolSchema = z.object(
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
    number: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .min(1, { error: "Номер не указан" }),
    date: z.coerce
      .date({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_DATETIME_TYPE
          }
        },
      })
      .transform((val) => stripTimezone(val)),
    studies: z
      .array(
        // Для устранения ошибок с циклическими зависимостями
        z.lazy(() => {
          const { StudySchema } = require("@/Studies")
          return StudySchema
        }),
        {
          error: (issue) => {
            switch (issue.code) {
              case "invalid_type":
                return ZOD_INVALID_OBJECT_TYPE
            }
          },
        }
      )
      .min(1, { error: "Укажите хотя бы одно обучение" }),
    studyOrganization:
      // Для устранения ошибок с циклическими зависимостями
      z
        .lazy(() => {
          const { StudyOrganizationSchema } = require("@/StudyOrganizations")
          return StudyOrganizationSchema
        })
        .nullish(),
    workspace:
      // Для устранения ошибок с циклическими зависимостями
      z.lazy(() => {
        const { WorkspaceSchema } = require("@/Workspaces")
        return WorkspaceSchema
      }),
    // TODO files
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined
        ? "Протокол не указан"
        : ZOD_INVALID_OBJECT_TYPE,
  }
)

export type Protocol = z.infer<typeof ProtocolSchema>
