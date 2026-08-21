import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_NUMBER_TYPE,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
  ZOD_VALUE_REQUIRED,
} from "@/lib/zod/commonErrors"

/**
 * Схема валидации FileEntity
 */
export const FileEntitySchema = z.object(
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
    s3name: z.string({
      error: (issue) =>
        issue.input === undefined
          ? ZOD_VALUE_REQUIRED
          : ZOD_INVALID_STRING_TYPE,
    }),
    fileName: z.string({
      error: (issue) =>
        issue.input === undefined
          ? ZOD_VALUE_REQUIRED
          : ZOD_INVALID_STRING_TYPE,
    }),
    mimeType: z.string({
      error: (issue) =>
        issue.input === undefined
          ? ZOD_VALUE_REQUIRED
          : ZOD_INVALID_STRING_TYPE,
    }),
    size: z.number({
      error: (issue) =>
        issue.input === undefined
          ? ZOD_VALUE_REQUIRED
          : ZOD_INVALID_NUMBER_TYPE,
    }),
    // TODO доп контроль при upsert, если оставить nonoptional, то будет бесконечная вложенность валидаций
    // company:
    //     // Для устранения ошибок с циклическими зависимостями
    //     z
    //         .lazy(() => {
    //             const { CompanyEntitySchema } = require("@/Companies");
    //             return CompanyEntitySchema;
    //         })
    //         .nullish(),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined ? ZOD_VALUE_REQUIRED : ZOD_INVALID_OBJECT_TYPE,
  }
)
