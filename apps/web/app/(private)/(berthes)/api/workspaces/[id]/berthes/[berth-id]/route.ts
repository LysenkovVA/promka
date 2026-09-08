"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { Berth, BerthSchema } from "../../../../../model/types/berth.schema"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { Prisma } from "@workspace/database/.generated/client"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; "berth-id": string }> }
): Promise<NextResponse<ResponseData<Berth | undefined>>> {
  try {
    const { id, "berth-id": berthId } = await props.params

    await checkAuthForWorkspace(id)

    const candidate = await prisma.berth.findFirst({
      where: { id: berthId },
      include: {
        workspace: { include: { company: true } },
      },
    })

    if (!candidate)
      return ResponseData.BadRequest(["Должность не найдена"]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Berth>(candidate).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string; "berth-id": string }> }
): Promise<NextResponse<ResponseData<Berth | undefined>>> {
  try {
    const { id, "berth-id": berthId } = await props.params

    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(BerthSchema, entityToSave)

    const updatedData = await prisma.berth.update({
      data: {
        name: validatedData.name ?? Prisma.skip,
      },
      where: { id: berthId },
      include: {
        workspace: { include: { company: true } },
      },
    })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные должности не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Berth>(updatedData).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string; "berth-id": string }> }
): Promise<NextResponse<ResponseData<Berth | undefined>>> {
  try {
    const { id, "berth-id": berthId } = await props.params

    await checkAuthForWorkspace(id)

    const deletedBerth = await prisma.berth.delete({
      where: { id: berthId },
    })

    // @ts-ignore
    return ResponseData.Ok<Berth>(deletedBerth).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
