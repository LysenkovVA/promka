"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { Prisma } from "@workspace/database/.generated/client"
import {
  Specialization,
  SpecializationSchema,
} from "../../../../../model/types/specialization.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; "specialization-id": string }> }
): Promise<NextResponse<ResponseData<Specialization | undefined>>> {
  try {
    const { id, "specialization-id": specializationId } = await props.params

    await checkAuthForWorkspace(id)

    const candidate = await prisma.specialization.findFirst({
      where: { id: specializationId },
      include: {
        specializationDirection: true,
        specializationParameter: true,
      },
    })

    if (!candidate)
      return ResponseData.BadRequest([
        "Тип удостоверения не найден",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Specialization>(candidate).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string; "specialization-id": string }> }
): Promise<NextResponse<ResponseData<Specialization | undefined>>> {
  try {
    const { id, "specialization-id": specializationId } = await props.params

    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(
      SpecializationSchema,
      entityToSave
    )

    const updatedData = await prisma.specialization.update({
      data: {
        specializationDirection: {
          connect: { id: validatedData.specializationDirection.id },
        },
        hasParameter: validatedData.hasParameter,
        specializationParameter: validatedData.specializationParameter?.id
          ? { connect: { id: validatedData.specializationParameter.id } }
          : Prisma.skip,
        specializationParameterValue:
          validatedData.specializationParameterValue,
        durationAtMonths: validatedData.durationAtMonths ?? Prisma.skip,
        validAtOrganizationOnly: validatedData.validAtOrganizationOnly,
      },
      where: { id: specializationId },
      include: {
        specializationDirection: true,
        specializationParameter: true,
      },
    })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные типа удостоверения не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Specialization>(updatedData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string; "specialization-id": string }> }
): Promise<NextResponse<ResponseData<Specialization | undefined>>> {
  try {
    const { id, "specialization-id": specializationId } = await props.params

    await checkAuthForWorkspace(id)

    const deletedCertificate = await prisma.specialization.delete({
      where: { id: specializationId },
    })

    // @ts-ignore
    return ResponseData.Ok<Specialization>(deletedCertificate).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
