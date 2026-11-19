import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_DATETIME_TYPE,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
} from "@/lib/zod/commonErrors"
import { stripTimezone } from "@/lib/date/utils"
import { ProtocolStudyLocation } from "@workspace/database/prisma/.generated/enums"
import { WorkspaceSchema } from "@/Workspaces"

export const ProtocolRequestSchema = z
  .object(
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
      number: z
        .string({
          error: (issue) => {
            switch (issue.code) {
              case "invalid_type":
                return ZOD_INVALID_STRING_TYPE
            }
          },
        })
        .min(1, { error: "Не указан номер протокола" }),
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
      studyLocation: z
        .enum([
          ProtocolStudyLocation.AT_COMPANY,
          ProtocolStudyLocation.AT_STUDY_ORGANIZATION,
        ])
        .default("AT_COMPANY"),
      studyOrganization: z
        .object(
          {
            id: z.cuid2({
              error: (issue) => {
                switch (issue.code) {
                  case "invalid_type":
                    return "Укажите учебный центр"
                  case "invalid_format":
                    return ZOD_INVALID_CUID_FORMAT(issue.input)
                }
              },
            }),
          },
          { error: "Укажите учебный центр" }
        )
        .nullish(),
      studies: z
        .array(
          z
            .object({
              specialization: z.object(
                {
                  id: z.cuid2({
                    error: (issue) => {
                      switch (issue.code) {
                        case "invalid_type":
                          return ZOD_INVALID_STRING_TYPE
                        case "invalid_format":
                          return ZOD_INVALID_CUID_FORMAT(issue.input)
                      }
                    },
                  }),
                },
                { error: "Укажите специализацию" }
              ),
              employees: z
                .array(
                  z.object({
                    id: z.cuid2({
                      error: (issue) => {
                        switch (issue.code) {
                          case "invalid_type":
                            return "Укажите сотрудника"
                          case "invalid_format":
                            return ZOD_INVALID_CUID_FORMAT(issue.input)
                        }
                      },
                    }),
                  })
                  // { error: "Укажите хотя бы одного сотрудника 1" }
                )
                .nullish(),
              certificates: z
                .array(
                  z.object({
                    employee: z.object(
                      {
                        id: z.cuid2({
                          error: (issue) => {
                            switch (issue.code) {
                              case "invalid_type":
                                return ZOD_INVALID_STRING_TYPE
                              case "invalid_format":
                                return ZOD_INVALID_CUID_FORMAT(issue.input)
                            }
                          },
                        }),
                      },
                      { error: "Укажите сотрудника" }
                    ),
                    number: z
                      .string({
                        error: (issue) => {
                          switch (issue.code) {
                            case "invalid_type":
                              return ZOD_INVALID_STRING_TYPE
                          }
                        },
                      })
                      .min(1, { error: "Не указан номер удостоверения" }),
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
                  })
                )
                .nullish(),
            })
            .refine(
              (study) => {
                const hasEmployees =
                  Array.isArray(study.employees) && study.employees.length > 0
                const hasCertificates =
                  Array.isArray(study.certificates) &&
                  study.certificates.length > 0
                return hasEmployees || hasCertificates
              },
              {
                error: "Добавьте список сотрудников или список удостоверений",
              }
            )
        )
        .min(1, { error: "Укажите хотя бы одно обучение" }),
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
          ? "Протокол не указан"
          : ZOD_INVALID_OBJECT_TYPE,
    }
  )
  .superRefine((data, ctx) => {
    if (
      data.studyLocation === ProtocolStudyLocation.AT_STUDY_ORGANIZATION &&
      !data.studyOrganization
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["studyOrganization"],
        message: "Укажите организацию для обучения", // Ваше сообщение об ошибке
      })
    }
  })
