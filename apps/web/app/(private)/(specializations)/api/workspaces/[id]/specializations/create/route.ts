"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)"
import { validateObject } from "@/lib/zod/validateObject"
import { prisma } from "@workspace/database/prisma"
import {
  Specialization,
  SpecializationSchema,
} from "../../../../../model/types/specialization.schema"
import { ServerError } from "@/lib/responses/ServerError"
import { Prisma } from "@workspace/database/.generated/client"

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Specialization | undefined>>> {
  try {
    const { id } = await props.params

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(
      SpecializationSchema,
      entityToSave
    )

    const createdData = await prisma.specialization.create({
      data: {
        specializationDirection: {
          connect: { id: validatedData.specializationDirection.id },
        },
        hasParameter: validatedData.hasParameter,
        specializationParameter: validatedData.specializationParameter?.id
          ? { connect: { id: validatedData.specializationParameter.id } }
          : Prisma.skip,
        specializationParameterValue:
          validatedData.specializationParameterValue ?? Prisma.skip,
        durationAtMonths: validatedData.durationAtMonths,
        validAtOrganizationOnly: validatedData.validAtOrganizationOnly,
        workspace: {
          connect: { id: id },
        },
      },
      include: {
        specializationDirection: true,
        specializationParameter: true,
      },
    })

    // @ts-ignore
    return ResponseData.Ok<Specialization>(createdData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
