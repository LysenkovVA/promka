"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { ServerError } from "@/lib/responses/ServerError"
import { EmployeesStatistics } from "@/Employees/model/types/employees-statistics"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<EmployeesStatistics | undefined>>> {
  try {
    const { id } = await props.params

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const count = await prisma.employee.count({
      where: { workspace: { id: id } },
    })

    // @ts-ignore
    return ResponseData.Ok<EmployeesStatistics>({
      count: count,
    }).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
