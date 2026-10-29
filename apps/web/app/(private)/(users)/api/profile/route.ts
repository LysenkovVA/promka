"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { Employee } from "@/Employees"
import { checkAuth } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { ServerError } from "@/lib/responses/ServerError"
import { User } from "../../model/types/UserSchema"
import { ProfileRequestSchema } from "../../model/types/profile-request.schema"

export async function PATCH(
  request: NextRequest
): Promise<NextResponse<ResponseData<User | undefined>>> {
  try {
    const userId = await checkAuth()

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(
      ProfileRequestSchema,
      entityToSave
    )

    const updatedData = await prisma.user.update({
      data: {
        surname: validatedData.surname,
        name: validatedData.name ?? null,
        patronymic: validatedData.patronymic ?? null,
        birthDate: validatedData.birthDate ?? null,
        snils: validatedData.snils ?? null,
        phoneNumber: validatedData.phoneNumber ?? null,
        email: validatedData.email!,
      },
      where: { id: userId },
      include: {
        avatar: true,
        teamMembers: {
          include: {
            workspace: { include: { company: true } },
            workspacePermissions: true,
          },
          orderBy: {
            workspace: { company: { name: "asc" } },
          },
        },
      },
    })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные профиля не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Employee>(updatedData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
