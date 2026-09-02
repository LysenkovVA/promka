"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { validateObject } from "@/lib/zod/validateObject"
import { prisma } from "@workspace/database/prisma"
import {
  Employee,
  EmployeeSchema,
} from "../../../../../model/types/employee.schema"
import { Prisma } from "@workspace/database/.generated/client"

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Employee | undefined>>> {
  try {
    const { id } = await props.params

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(EmployeeSchema, entityToSave)

    const createdData = await prisma.employee.create({
      data: {
        surname: validatedData.surname,
        name: validatedData.name ?? Prisma.skip,
        workspace: {
          connect: { id: id },
        },
      },
    })

    return ResponseData.Ok<Employee>(createdData).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
