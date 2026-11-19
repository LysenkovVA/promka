import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
} from "@/lib/zod/commonErrors"

/**
 * Схема валидации DiplomaSchema
 */
export const DiplomaSchema = z.object(
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
    series: z.coerce.string().min(4).max(4),
    number: z.coerce.string().min(6).max(6),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined ? "Паспорт не указан" : ZOD_INVALID_OBJECT_TYPE,
  }
)

export type Diploma = z.infer<typeof DiplomaSchema>
