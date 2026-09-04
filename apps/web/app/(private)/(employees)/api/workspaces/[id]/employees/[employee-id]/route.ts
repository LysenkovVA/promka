"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { Employee, EmployeeSchema } from "@/Employees"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { Prisma } from "@workspace/database/.generated/client"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; "employee-id": string }> }
): Promise<NextResponse<ResponseData<Employee | undefined>>> {
  try {
    const { id, "employee-id": employeeId } = await props.params

    await checkAuthForWorkspace(id)

    const candidate = await prisma.employee.findFirst({
      where: { id: employeeId },
      include: {
        workspace: { include: { company: true } },
      },
    })

    if (!candidate)
      return ResponseData.BadRequest(["Сотрудник не найден"]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Employee>(candidate).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string; "employee-id": string }> }
): Promise<NextResponse<ResponseData<Employee | undefined>>> {
  try {
    const { id, "employee-id": employeeId } = await props.params

    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(EmployeeSchema, entityToSave)

    const updatedData = await prisma.employee.update({
      data: {
        surname: validatedData.surname ?? Prisma.skip,
        name: validatedData.name ?? Prisma.skip,
        patronymic: validatedData.patronymic ?? Prisma.skip,
        birthDate: validatedData.birthDate ?? Prisma.skip,
        snils: validatedData.snils ?? Prisma.skip,
        hireDate: validatedData.hireDate ?? Prisma.skip,
        firedDate: validatedData.firedDate ?? Prisma.skip,
        phoneNumber: validatedData.phoneNumber ?? Prisma.skip,
        email: validatedData.email ?? Prisma.skip,
      },
      where: { id: employeeId },
    })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные сотрудника не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Employee>(updatedData).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string; "employee-id": string }> }
): Promise<NextResponse<ResponseData<Employee | undefined>>> {
  try {
    const { id, "employee-id": employeeId } = await props.params

    await checkAuthForWorkspace(id)

    const deletedEmployee = await prisma.employee.delete({
      where: { id: employeeId },
    })

    // @ts-ignore
    return ResponseData.Ok<Employee>(deletedEmployee).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
