"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { Prisma } from "@workspace/database/.generated/client"
import {
  CertificateType,
  CertificateTypeSchema,
} from "../../../../../model/types/certificate-type.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; "certificate-type-id": string }> }
): Promise<NextResponse<ResponseData<CertificateType | undefined>>> {
  try {
    const { id, "certificate-type-id": certificateTypeId } = await props.params

    await checkAuthForWorkspace(id)

    const candidate = await prisma.certificateType.findFirst({
      where: { id: certificateTypeId },
      include: {
        workspace: { include: { company: true } },
      },
    })

    if (!candidate)
      return ResponseData.BadRequest([
        "Тип удостоверения не найден",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<CertificateType>(candidate).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string; "certificate-type-id": string }> }
): Promise<NextResponse<ResponseData<CertificateType | undefined>>> {
  try {
    const { id, "certificate-type-id": certificateTypeId } = await props.params

    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(
      CertificateTypeSchema,
      entityToSave
    )

    const updatedData = await prisma.certificateType.update({
      data: {
        name: validatedData.name ?? Prisma.skip,
        hasGroups: validatedData.hasGroups ?? Prisma.skip,
        durationAtMonths: validatedData.durationAtMonths ?? Prisma.skip,
      },
      where: { id: certificateTypeId },
      include: {
        workspace: { include: { company: true } },
      },
    })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные типа удостоверения не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<CertificateType>(updatedData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string; "certificate-type-id": string }> }
): Promise<NextResponse<ResponseData<CertificateType | undefined>>> {
  try {
    const { id, "certificate-type-id": certificateTypeId } = await props.params

    await checkAuthForWorkspace(id)

    const deletedCertificate = await prisma.certificateType.delete({
      where: { id: certificateTypeId },
    })

    // @ts-ignore
    return ResponseData.Ok<CertificateType>(deletedCertificate).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
