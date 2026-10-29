"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { Prisma } from "@workspace/database/.generated/client"
import {
  BerthType,
  BerthTypeSchema,
} from "../../../../../model/types/berth-type.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; "berth-type-id": string }> }
): Promise<NextResponse<ResponseData<BerthType | undefined>>> {
  try {
    const { id, "berth-type-id": berthTypeId } = await props.params

    await checkAuthForWorkspace(id)

    const candidate = await prisma.berthType.findFirst({
      where: { id: berthTypeId },
    })

    if (!candidate)
      return ResponseData.BadRequest([
        "Тип должности не найден",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<BerthType>(candidate).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string; "berth-type-id": string }> }
): Promise<NextResponse<ResponseData<BerthType | undefined>>> {
  try {
    const { id, "berth-type-id": berthTypeId } = await props.params

    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(BerthTypeSchema, entityToSave)

    const updatedData = await prisma.berthType.update({
      data: {
        name: validatedData.name ?? Prisma.skip,
      },
      where: { id: berthTypeId },
    })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные типа должности не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<BerthType>(updatedData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string; "berth-type-id": string }> }
): Promise<NextResponse<ResponseData<BerthType | undefined>>> {
  try {
    const { id, "berth-type-id": berthTypeId } = await props.params

    await checkAuthForWorkspace(id)

    const deletedBerth = await prisma.berthType.delete({
      where: { id: berthTypeId },
    })

    // @ts-ignore
    return ResponseData.Ok<BerthType>(deletedBerth).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
