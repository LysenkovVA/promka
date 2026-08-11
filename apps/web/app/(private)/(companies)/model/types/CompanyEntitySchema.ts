import { z, ZodType } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
  ZOD_VALUE_REQUIRED,
} from "@/lib/zod/commonErrors"
import { ICompanyEntity } from "./ICompanyEntity"

/**
 * Схема валидации CompanyEntitySchema
 */
export const CompanyEntitySchema: ZodType<ICompanyEntity> = z.object(
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
      .min(1, { error: "Название компании обязательно" }),
    address: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
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
