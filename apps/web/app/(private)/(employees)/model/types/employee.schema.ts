import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_DATETIME_TYPE,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
  ZOD_VALUE_REQUIRED,
} from "@/lib/zod/commonErrors"
import { WorkspaceSchema } from "@/Workspaces"
import { stripTimezone } from "@/lib/date/utils"
import { BerthSchema } from "@/Berthes"
import { DepartmentSchema } from "@/Departments"
import { isValidPhoneNumber } from "react-phone-number-input/input"

// Функция валидации контрольной суммы СНИЛС
const validateSnils = (snils: string) => {
  if (!snils) return true

  // Убираем все символы, кроме цифр
  const cleanSnils = snils.replace(/\D/g, "")

  if (cleanSnils.length !== 11) return false

  // Проверка на зарезервированные последовательности
  if (parseInt(cleanSnils.slice(0, 9)) <= 1001998) return true

  const digits = cleanSnils.slice(0, 9).split("").map(Number)
  const checksum = parseInt(cleanSnils.slice(9, 11))

  let sum = 0
  for (let i = 0; i < 9; i++) {
    // @ts-ignore
    sum += digits[i] * (9 - i)
  }

  let calculatedChecksum = 0
  if (sum < 100) {
    calculatedChecksum = sum
  } else if (sum === 100 || sum === 101) {
    calculatedChecksum = 0
  } else {
    const remainder = sum % 101
    calculatedChecksum = remainder === 100 || remainder === 101 ? 0 : remainder
  }

  return calculatedChecksum === checksum
}

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
    snils: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .refine(validateSnils, { message: "Неверный контрольный номер СНИЛС" })
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
    workspace:
      // Для устранения ошибок с циклическими зависимостями
      z
        .lazy<typeof WorkspaceSchema>(() => {
          const { WorkspaceSchema } = require("@/Workspaces")
          return WorkspaceSchema
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
    certificates: z
      .array(
        // Для устранения ошибок с циклическими зависимостями
        z.lazy(() => {
          const { CertificateSchema } = require("@/Certificates")
          return CertificateSchema
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
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined ? ZOD_VALUE_REQUIRED : ZOD_INVALID_OBJECT_TYPE,
  }
)

export type Employee = z.infer<typeof EmployeeSchema>
