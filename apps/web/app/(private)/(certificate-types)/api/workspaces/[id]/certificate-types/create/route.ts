"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { validateObject } from "@/lib/zod/validateObject"
import { prisma } from "@workspace/database/prisma"
import {
  CertificateType,
  CertificateTypeSchema,
} from "../../../../../model/types/certificate-type.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<CertificateType | undefined>>> {
  try {
    const { id } = await props.params

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(
      CertificateTypeSchema,
      entityToSave
    )

    const createdData = await prisma.certificateType.create({
      data: {
        name: validatedData.name,
        hasGroups: validatedData.hasGroups,
        durationAtMonths: validatedData.durationAtMonths,
        workspace: {
          connect: { id: id },
        },
      },
      // include: {
      //   workspace: { include: { company: true } },
      // },
    })

    // @ts-ignore
    return ResponseData.Ok<CertificateType>(createdData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
