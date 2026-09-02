"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { Employee } from "../../../../model/types/employee.schema"
import { TAKE } from "@/config/app"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Employee[] | undefined>>> {
  try {
    const { id } = await props.params
    const { searchParams } = new URL(request.url)

    const take = searchParams.get("take") || TAKE
    const skip = searchParams.get("skip") || 0

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const data = await prisma.employee.findMany({
      where: { workspace: { id: id } },
      take: Number(take),
      skip: Number(skip),
    })

    return ResponseData.Ok<Employee[]>(data).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
