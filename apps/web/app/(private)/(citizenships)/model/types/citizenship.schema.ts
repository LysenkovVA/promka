import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
} from "@/lib/zod/commonErrors"

export const CitizenshipSchema = z.object(
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
    name: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .min(1, { error: "Название не указано" }),
    // workspace:
    //   // Для устранения ошибок с циклическими зависимостями
    //   z
    //     .lazy<typeof WorkspaceSchema>(() => {
    //       const { WorkspaceSchema } = require("@/Workspaces")
    //       return WorkspaceSchema
    //     })
    //     .nullish(),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined
        ? "Гражданство не указано"
        : ZOD_INVALID_OBJECT_TYPE,
  }
)

export type Citizenship = z.infer<typeof CitizenshipSchema>
