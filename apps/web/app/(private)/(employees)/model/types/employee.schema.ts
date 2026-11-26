import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_DATETIME_TYPE,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
} from "@/lib/zod/commonErrors"
import { stripTimezone } from "@/lib/date/utils"
import { BerthSchema } from "@/Berthes"
import { DepartmentSchema } from "@/Departments"
import { isValidPhoneNumber } from "react-phone-number-input/input"
import { CitizenshipSchema } from "@/Citizenships"

/**
 * Схема валидации EmployeeSchema
 */
export const EmployeeSchema = z.object(
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
    surname: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .min(1, { error: "Фамилия сотрудника не указана" }),
    name: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .nullish(),
    patronymic: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .nullish(),
    birthDate: z.coerce
      .date({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_DATETIME_TYPE
          }
        },
      })
      .transform((val) => stripTimezone(val))
      .nullish(),
    citizenship:
      // Для устранения ошибок с циклическими зависимостями
      z
        .lazy<typeof CitizenshipSchema>(() => {
          const { CitizenshipSchema } = require("@/Citizenships")
          return CitizenshipSchema
        })
        .nullish(),
    hireDate: z.coerce
      .date({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_DATETIME_TYPE
          }
        },
      })
      .transform((val) => stripTimezone(val))
      .nullish(),
    firedDate: z.coerce
      .date({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_DATETIME_TYPE
          }
        },
      })
      .transform((val) => stripTimezone(val))
      .nullish(),
    phoneNumber: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .refine((val) => !val || isValidPhoneNumber(val), {
        message: "Неверный формат номера телефона",
      })
      .nullish(),
    email: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .nullish(),
    berth:
      // Для устранения ошибок с циклическими зависимостями
      z
        .lazy<typeof BerthSchema>(() => {
          const { BerthSchema } = require("@/Berthes")
          return BerthSchema
        })
        .nullish(),
    department:
      // Для устранения ошибок с циклическими зависимостями
      z
        .lazy<typeof DepartmentSchema>(() => {
          const { DepartmentSchema } = require("@/Departments")
          return DepartmentSchema
        })
        .nullish(),
    passports: z
      .array(
        // Для устранения ошибок с циклическими зависимостями
        z.lazy(() => {
          const { PassportSchema } = require("@/Passports")
          return PassportSchema
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
      .nullish(),
    snilses: z
      .array(
        // Для устранения ошибок с циклическими зависимостями
        z.lazy(() => {
          const { SnilsSchema } = require("@/Snilses")
          return SnilsSchema
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
      .nullish(),
    diplomas: z
      .array(
        // Для устранения ошибок с циклическими зависимостями
        z.lazy(() => {
          const { DiplomaSchema } = require("@/Diplomas")
          return DiplomaSchema
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
      .nullish(),
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
      .nullish(),
    workspace:
      // Для устранения ошибок с циклическими зависимостями
      z
        .lazy(() => {
          const { WorkspaceSchema } = require("@/Workspaces")
          return WorkspaceSchema
        })
        .nullish(),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined
        ? "Сотрудник не указан"
        : ZOD_INVALID_OBJECT_TYPE,
  }
)

export type Employee = z.infer<typeof EmployeeSchema>
