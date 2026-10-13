"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { Prisma } from "@workspace/database/.generated/client"
import {
  Certificate,
  CertificateSchema,
} from "../../../../../model/types/certificate.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; "certificate-id": string }> }
): Promise<NextResponse<ResponseData<Certificate | undefined>>> {
  try {
    const { id, "certificate-id": certificateId } = await props.params

    await checkAuthForWorkspace(id)

    const candidate = await prisma.certificate.findFirst({
      where: { id: certificateId },
      include: {
        workspace: { include: { company: true } },
        certificateType: true,
        employee: true,
      },
    })

    if (!candidate)
      return ResponseData.BadRequest([
        "Удостоверение не найдено",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Certificate>(candidate).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string; "certificate-id": string }> }
): Promise<NextResponse<ResponseData<Certificate | undefined>>> {
  try {
    const { id, "certificate-id": certificateId } = await props.params

    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(CertificateSchema, entityToSave)

    const updatedData = await prisma.certificate.update({
      data: {
        number: validatedData.number ?? Prisma.skip,
        date: validatedData.date ?? Prisma.skip,
        group: validatedData.group ?? Prisma.skip,
        certificateType: { connect: { id: validatedData.certificateType.id! } },
        employee: { connect: { id: validatedData.employee!.id! } },
      },
      where: { id: certificateId },
      include: {
        workspace: { include: { company: true } },
        certificateType: true,
        employee: true,
      },
    })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные удостоверения не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Certificate>(updatedData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string; "certificate-id": string }> }
): Promise<NextResponse<ResponseData<Certificate | undefined>>> {
  try {
    const { id, "certificate-id": certificateId } = await props.params

    await checkAuthForWorkspace(id)

    const deletedBerth = await prisma.certificate.delete({
      where: { id: certificateId },
    })

    // @ts-ignore
    return ResponseData.Ok<Certificate>(deletedBerth).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
