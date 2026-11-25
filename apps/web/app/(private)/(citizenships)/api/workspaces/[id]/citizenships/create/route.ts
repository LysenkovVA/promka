"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)"
import { validateObject } from "@/lib/zod/validateObject"
import { prisma } from "@workspace/database/prisma"
import {
  Citizenship,
  CitizenshipSchema,
} from "../../../../../model/types/citizenship.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Citizenship | undefined>>> {
  try {
    const { id } = await props.params

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(CitizenshipSchema, entityToSave)

    const createdData = await prisma.citizenship.create({
      data: {
        name: validatedData.name,
        workspace: {
          connect: { id: id },
        },
      },
    })

    // @ts-ignore
    return ResponseData.Ok<Citizenship>(createdData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
