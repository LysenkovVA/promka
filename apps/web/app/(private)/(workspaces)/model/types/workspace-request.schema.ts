import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
} from "@/lib/zod/commonErrors"

/**
 * Схема валидации WorkspaceRequestSchema
 */
export const WorkspaceRequestSchema = z.object(
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
    company: z.object(
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
        name: z.string({
          error: (issue) => {
            switch (issue.code) {
              case "invalid_type":
                return ZOD_INVALID_STRING_TYPE
            }
          },
        }),
      },
      { error: "Укажите организацию" }
    ),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined
        ? "Организация (workspace) не указана"
        : ZOD_INVALID_OBJECT_TYPE,
  }
)
