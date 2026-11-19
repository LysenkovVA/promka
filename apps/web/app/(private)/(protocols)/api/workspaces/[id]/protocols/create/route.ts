"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)"
import { validateObject } from "@/lib/zod/validateObject"
import { prisma } from "@workspace/database/prisma"
import { ServerError } from "@/lib/responses/ServerError"
import { ProtocolRequestSchema } from "@/Protocols/model/types/protocol-request.schema"
import { Prisma } from "@workspace/database/.generated/client"
import { Protocol } from "../../../../../model/types/protocol.schema"

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Protocol | undefined>>> {
  try {
    const { id: workspaceId } = await props.params

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(workspaceId)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(
      ProtocolRequestSchema,
      entityToSave
    )

    const createdData = await prisma.protocol.create({
      data: {
        // Место обучения
        studyLocation: validatedData.studyLocation,
        // Учебный центр
        studyOrganization: validatedData.studyOrganization?.id
          ? { connect: { id: validatedData.studyOrganization.id } }
          : Prisma.skip,
        // Номер протокола
        number: validatedData.number,
        // Дата протокола
        date: validatedData.date,
        // Обучения
        studies: {
          create: validatedData.studies.map((newStudy) => {
            return {
              // Специализация
              specialization: { connect: { id: newStudy.specialization.id } },
              // Сотрудники (если есть)
              ...(newStudy.employees && newStudy.employees.length > 0
                ? {
                    employees: {
                      connect: newStudy.employees.map((employee) => {
                        return { id: employee.id }
                      }),
                    },
                  }
                : Prisma.skip),
              // Удоствоерения (если есть)
              ...(newStudy.certificates && newStudy.certificates.length > 0
                ? {
                    certificates: {
                      create: newStudy.certificates.map((newCertificate) => {
                        return {
                          // Сотрудник
                          employee: {
                            connect: { id: newCertificate.employee.id },
                          },
                          // Номер удоствоерения
                          number: newCertificate.number,
                          // Дата удостоверения
                          date: newCertificate.date,
                          // Workspace
                          workspace: {
                            connect: { id: workspaceId },
                          },
                        }
                      }),
                    },
                  }
                : Prisma.skip),
              // Workspace
              workspace: {
                connect: { id: workspaceId },
              },
            }
          }),
        },
        // Workspace
        workspace: {
          connect: { id: workspaceId },
        },
      },
      include: {
        studyOrganization: true,
        studies: {
          include: {
            specialization: {
              include: {
                specializationDirection: true,
                specializationParameter: true,
              },
            },
            employees: {
              include: {
                berth: { include: { berthType: true } },
                department: true,
                workspace: { include: { company: true } },
              },
            },
            certificates: {
              include: {
                employee: {
                  include: {
                    berth: { include: { berthType: true } },
                    department: true,
                  },
                },
                study: {
                  include: {
                    specialization: {
                      include: {
                        specializationDirection: true,
                        specializationParameter: true,
                      },
                    },
                    protocol: {
                      include: { workspace: { include: { company: true } } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    // @ts-ignore
    return ResponseData.Ok<Protocol>(createdData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
