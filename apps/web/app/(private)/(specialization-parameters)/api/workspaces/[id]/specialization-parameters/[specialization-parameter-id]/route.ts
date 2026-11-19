"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { Prisma } from "@workspace/database/.generated/client"
import {
  SpecializationParameter,
  SpecializationParameterSchema,
} from "../../../../../model/types/specialization-parameter.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function GET(
  request: NextRequest,
  props: {
    params: Promise<{ id: string; "specialization-parameter-id": string }>
  }
): Promise<NextResponse<ResponseData<SpecializationParameter | undefined>>> {
  try {
    const { id, "specialization-parameter-id": specializationParameterId } =
      await props.params

    await checkAuthForWorkspace(id)

    const candidate = await prisma.specializationParameter.findFirst({
      where: { id: specializationParameterId },
    })

    if (!candidate)
      return ResponseData.BadRequest([
        "Параметр типа удостоверения не найден",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<SpecializationParameter>(candidate).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function PATCH(
  request: NextRequest,
  props: {
    params: Promise<{ id: string; "specialization-parameter-id": string }>
  }
): Promise<NextResponse<ResponseData<SpecializationParameter | undefined>>> {
  try {
    const { id, "specialization-parameter-id": specializationParameterId } =
      await props.params

    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(
      SpecializationParameterSchema,
      entityToSave
    )

    const updatedData = await prisma.specializationParameter.update({
      data: {
        name: validatedData.name ?? Prisma.skip,
      },
      where: { id: specializationParameterId },
    })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные параметра типа удостоверения не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<SpecializationParameter>(
      updatedData
    ).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function DELETE(
  request: NextRequest,
  props: {
    params: Promise<{ id: string; "specialization-parameter-id": string }>
  }
): Promise<NextResponse<ResponseData<SpecializationParameter | undefined>>> {
  try {
    const { id, "specialization-parameter-id": specializationParameterId } =
      await props.params

    await checkAuthForWorkspace(id)

    const deletedCertificate = await prisma.specializationParameter.delete({
      where: { id: specializationParameterId },
    })

    // @ts-ignore
    return ResponseData.Ok<SpecializationParameter>(
      deletedCertificate
    ).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
