"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { Prisma } from "@workspace/database/.generated/client"
import {
  Citizenship,
  CitizenshipSchema,
} from "../../../../../model/types/citizenship.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; "citizenship-id": string }> }
): Promise<NextResponse<ResponseData<Citizenship | undefined>>> {
  try {
    const { id, "citizenship-id": citizenshipId } = await props.params

    await checkAuthForWorkspace(id)

    const candidate = await prisma.citizenship.findFirst({
      where: { id: citizenshipId },
    })

    if (!candidate)
      return ResponseData.BadRequest([
        "Гражданство не найдено",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Citizenship>(candidate).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string; "citizenship-id": string }> }
): Promise<NextResponse<ResponseData<Citizenship | undefined>>> {
  try {
    const { id, "citizenship-id": citizenshipId } = await props.params

    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(CitizenshipSchema, entityToSave)

    const updatedData = await prisma.citizenship.update({
      data: {
        name: validatedData.name ?? Prisma.skip,
      },
      where: { id: citizenshipId },
    })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные гражданства не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Citizenship>(updatedData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string; "citizenship-id": string }> }
): Promise<NextResponse<ResponseData<Citizenship | undefined>>> {
  try {
    const { id, "citizenship-id": citizenshipId } = await props.params

    await checkAuthForWorkspace(id)

    const deletedBerth = await prisma.citizenship.delete({
      where: { id: citizenshipId },
    })

    // @ts-ignore
    return ResponseData.Ok<Citizenship>(deletedBerth).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
