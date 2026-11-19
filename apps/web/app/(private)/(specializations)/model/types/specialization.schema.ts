import { z } from "zod/v4"
import {
  ZOD_INVALID_BOOLEAN_TYPE,
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_NUMBER_TYPE,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
} from "@/lib/zod/commonErrors"

export const SpecializationSchema = z.object(
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
    specializationDirection:
      // Для устранения ошибок с циклическими зависимостями
      z.lazy(() => {
        const {
          SpecializationDirectionSchema,
        } = require("@/SpecializationDirections")
        return SpecializationDirectionSchema
      }),
    hasParameter: z
      .boolean({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_BOOLEAN_TYPE
          }
        },
      })
      .default(false),
    specializationParameter:
      // Для устранения ошибок с циклическими зависимостями
      z
        .lazy(() => {
          const {
            SpecializationParameterSchema,
          } = require("@/SpecializationParameters")
          return SpecializationParameterSchema
        })
        .nullish(),
    specializationParameterValue: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .nullish(),
    durationAtMonths: z
      .number({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_NUMBER_TYPE
          }
        },
      })
      .default(0),
    validAtOrganizationOnly: z.coerce
      .boolean({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_BOOLEAN_TYPE
          }
        },
      })
      .default(false),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined
        ? "Тип удостоверения не указан"
        : ZOD_INVALID_OBJECT_TYPE,
  }
)

export type Specialization = z.infer<typeof SpecializationSchema>
