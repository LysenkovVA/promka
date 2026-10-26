"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { validateObject } from "@/lib/zod/validateObject"
import { prisma } from "@workspace/database/prisma"
import { Protocol } from "../../../../../model/types/protocol.schema"
import { ServerError } from "@/lib/responses/ServerError"
import { ProtocolRequestSchema } from "@/Protocols/model/types/protocol-request.schema"
import { Prisma } from "@workspace/database/.generated/client"

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
        number: validatedData.number,
        date: validatedData.date,
        certificates: {
          create: validatedData.certificates.map((newCertificate) => {
            return {
              employee: { connect: { id: newCertificate.employee.id } },
              certificateType: {
                connect: { id: newCertificate.certificateType.id },
              },
              number: newCertificate.number,
              date: newCertificate.date,
              group: newCertificate.group ?? Prisma.skip,
              workspace: { connect: { id: workspaceId } },
            }
          }),
        },
        workspace: {
          connect: { id: workspaceId },
        },
      },
      include: {
        certificates: {
          include: {
            certificateType: true,
            employee: {
              include: {
                berth: { include: { berthType: true } },
                department: true,
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
