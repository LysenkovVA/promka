"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)"
import { validateObject } from "@/lib/zod/validateObject"
import { prisma } from "@workspace/database/prisma"
import {
  BerthType,
  BerthTypeSchema,
} from "../../../../../model/types/berth-type.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<BerthType | undefined>>> {
  try {
    const { id } = await props.params

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(BerthTypeSchema, entityToSave)

    const createdData = await prisma.berthType.create({
      data: {
        name: validatedData.name,
        workspace: {
          connect: { id: id },
        },
      },
      // include: {
      //   workspace: { include: { company: true } },
      // },
    })

    // @ts-ignore
    return ResponseData.Ok<BerthType>(createdData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
