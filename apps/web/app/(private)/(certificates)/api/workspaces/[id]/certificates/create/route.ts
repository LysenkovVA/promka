"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { validateObject } from "@/lib/zod/validateObject"
import { prisma } from "@workspace/database/prisma"
import {
  Certificate,
  CertificateSchema,
} from "../../../../../model/types/certificate.schema"
import { ServerError } from "@/lib/responses/ServerError"
import { Prisma } from "@workspace/database/.generated/client"

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Certificate | undefined>>> {
  try {
    const { id } = await props.params

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(CertificateSchema, entityToSave)

    const createdData = await prisma.certificate.create({
      data: {
        number: validatedData.number,
        date: validatedData.date,
        group: validatedData.group ?? Prisma.skip,
        certificateType: { connect: { id: validatedData.certificateType.id! } },
        employee: { connect: { id: validatedData.employee!.id! } },
        workspace: {
          connect: { id: id },
        },
      },
      include: {
        certificateType: true,
        employee: {
          include: {
            berth: { include: { berthType: true } },
            department: true,
          },
        },
        protocol: true,
      },
    })

    // @ts-ignore
    return ResponseData.Ok<Certificate>(createdData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
