import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_DATETIME_TYPE,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
} from "@/lib/zod/commonErrors"
import { WorkspaceSchema } from "@/Workspaces"
import { CertificateTypeSchema } from "@/CertificateTypes"
import { stripTimezone } from "@/lib/date/utils"
import { EmployeeSchema } from "@/Employees"
import { ProtocolSchema } from "@/Protocols"

export const CertificateSchema = z.object(
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
    certificateType:
      // Для устранения ошибок с циклическими зависимостями
      z.lazy<typeof CertificateTypeSchema>(() => {
        const { CertificateTypeSchema } = require("@/CertificateTypes")
        return CertificateTypeSchema
      }),
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
    group: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .nullish(),
    employee:
      // Для устранения ошибок с циклическими зависимостями
      z.lazy<typeof EmployeeSchema>(() => {
        const { EmployeeSchema } = require("@/Employees")
        return EmployeeSchema
      }),
    protocol:
      // Для устранения ошибок с циклическими зависимостями
      z
        .lazy<typeof ProtocolSchema>(() => {
          const { ProtocolSchema } = require("@/Protocols")
          return ProtocolSchema
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
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined
        ? "Удостоверение не указано"
        : ZOD_INVALID_OBJECT_TYPE,
  }
)

export type Certificate = z.infer<typeof CertificateSchema>
