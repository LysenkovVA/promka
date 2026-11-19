import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
} from "@/lib/zod/commonErrors"
import { SpecializationSchema } from "@/Specializations"

export const StudySchema = z.object(
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
    specialization:
      // Для устранения ошибок с циклическими зависимостями
      z.lazy(() => {
        const { SpecializationSchema } = require("@/Specializations")
        return SpecializationSchema
      }),
    employees: z
      .array(
        // Для устранения ошибок с циклическими зависимостями
        z.lazy(() => {
          const { EmployeeSchema } = require("@/Employees")
          return EmployeeSchema
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
    protocol:
      // Для устранения ошибок с циклическими зависимостями
      z.lazy(() => {
        const { ProtocolSchema } = require("@/Protocols")
        return ProtocolSchema
      }),
    workspace:
      // Для устранения ошибок с циклическими зависимостями
      z.lazy(() => {
        const { WorkspaceSchema } = require("@/Workspaces")
        return WorkspaceSchema
      }),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined
        ? "Обучение не указано"
        : ZOD_INVALID_OBJECT_TYPE,
  }
)

export type Study = z.infer<typeof StudySchema>
