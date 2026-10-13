"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { Employee, EmployeeSchema } from "@/Employees"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { Prisma } from "@workspace/database/.generated/client"
import { ServerError } from "@/lib/responses/ServerError"

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
        berth: { include: { berthType: true } },
        department: true,
        certificates: { include: { certificateType: true } },
      },
    })

    if (!candidate)
      return ResponseData.BadRequest(["Сотрудник не найден"]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Employee>(candidate).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
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

    // Получаем существующую запись, чтобы понять что делать с удостоверениями
    const existingData = await prisma.employee.findFirst({
      where: { id: employeeId },
      include: {
        workspace: { include: { company: true } },
        berth: { include: { berthType: true } },
        department: true,
        certificates: { include: { certificateType: true } },
      },
    })

    // Новые удостоверения
    const itemsToCreate = validatedData.certificates?.filter((item) => !item.id)
    // Удостоверения для обновления
    const itemsToUpdate = validatedData.certificates?.filter((item) => item.id)
    const existingItemIds =
      existingData?.certificates?.map((item) => item.id) || []
    const providedItemIds = itemsToUpdate?.map((item) => item.id!)
    // Удостоверения для удаления
    const itemsToDelete = existingItemIds.filter(
      (id) => !providedItemIds?.includes(id!)
    )

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
        ...(validatedData.berth?.id
          ? {
              berth: { connect: { id: validatedData.berth?.id } },
            }
          : { berth: { disconnect: true } }),
        ...(validatedData.department?.id
          ? {
              department: { connect: { id: validatedData.department?.id } },
            }
          : { department: { disconnect: true } }),
        certificates: {
          create:
            itemsToCreate && itemsToCreate.length > 0
              ? itemsToCreate.map((item) => {
                  return {
                    certificateType: {
                      connect: { id: item.certificateType.id! },
                    },
                    number: item.number,
                    date: item.date ?? Prisma.skip,
                    group: item.group ?? Prisma.skip,
                    workspace: {
                      connect: { id: validatedData.workspace!.id! },
                    },
                  }
                })
              : Prisma.skip,
          update:
            itemsToUpdate && itemsToUpdate.length > 0
              ? itemsToUpdate.map((item) => {
                  return {
                    data: {
                      certificateType: {
                        connect: { id: item.certificateType.id },
                      },
                      number: item.number ?? Prisma.skip,
                      date: item.date ?? Prisma.skip,
                      group: item.group ?? Prisma.skip,
                    },
                    where: { id: item.id },
                  }
                })
              : Prisma.skip,
          delete:
            itemsToDelete && itemsToDelete.length > 0
              ? itemsToDelete.map((itemId) => ({ id: itemId }))
              : Prisma.skip,
        },
      },
      where: { id: employeeId },
      include: {
        workspace: { include: { company: true } },
        berth: { include: { berthType: true } },
        department: true,
        certificates: { include: { certificateType: true } },
      },
    })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные сотрудника не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Employee>(updatedData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
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
    return ServerError.toNextResponse(error)
  }
}
