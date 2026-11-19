"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { Prisma } from "@workspace/database/.generated/client"
import {
  SpecializationDirection,
  SpecializationDirectionSchema,
} from "../../../../../model/types/specialization-direction.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function GET(
  request: NextRequest,
  props: {
    params: Promise<{ id: string; "specialization-direction-id": string }>
  }
): Promise<NextResponse<ResponseData<SpecializationDirection | undefined>>> {
  try {
    const { id, "specialization-direction-id": specializationDirectionId } =
      await props.params

    await checkAuthForWorkspace(id)

    const candidate = await prisma.specializationDirection.findFirst({
      where: { id: specializationDirectionId },
    })

    if (!candidate)
      return ResponseData.BadRequest([
        "Направление типа удостоверения не найден",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<SpecializationDirection>(candidate).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function PATCH(
  request: NextRequest,
  props: {
    params: Promise<{ id: string; "specialization-direction-id": string }>
  }
): Promise<NextResponse<ResponseData<SpecializationDirection | undefined>>> {
  try {
    const { id, "specialization-direction-id": specializationDirectionId } =
      await props.params

    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(
      SpecializationDirectionSchema,
      entityToSave
    )

    const updatedData = await prisma.specializationDirection.update({
      data: {
        name: validatedData.name ?? Prisma.skip,
      },
      where: { id: specializationDirectionId },
    })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные направления типа удостоверения не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<SpecializationDirection>(
      updatedData
    ).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function DELETE(
  request: NextRequest,
  props: {
    params: Promise<{ id: string; "specialization-direction-id": string }>
  }
): Promise<NextResponse<ResponseData<SpecializationDirection | undefined>>> {
  try {
    const { id, "specialization-direction-id": specializationDirectionId } =
      await props.params

    await checkAuthForWorkspace(id)

    const deletedCertificate = await prisma.specializationDirection.delete({
      where: { id: specializationDirectionId },
    })

    return ResponseData.Ok<SpecializationDirection>(
      // @ts-ignore
      deletedCertificate
    ).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
