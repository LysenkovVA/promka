"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { Employee } from "@/Employees"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; "employee-id": string }> }
): Promise<NextResponse<ResponseData<Employee | undefined>>> {
  try {
    const { id, "employee-id": employeeId } = await props.params

    await checkAuthForWorkspace(id)

    const candidate = await prisma.employee.findFirst({
      where: { id: employeeId },
    })

    if (!candidate)
      return ResponseData.BadRequest(["Сотрудник не найден"]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Employee>(candidate).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
//
// export async function DELETE(
//   request: NextRequest,
//   props: { params: Promise<{ id: string }> }
// ): Promise<NextResponse<ResponseData<IEmployeeEntity | undefined>>> {
//   try {
//     const { id } = await props.params
//
//     return (await deleteEmployeeById(id)).toNextResponse()
//   } catch (error) {
//     return ResponseData.InternalServerError(error).toNextResponse()
//   }
// }
