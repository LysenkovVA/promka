"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { Employee } from "../../../../../model/types/employee.schema"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { ServerError } from "@/lib/responses/ServerError"
import { EmployeeRequestSchema } from "../../../../../model/types/employee-request.schema"
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
        berth: { include: { berthType: true } },
        department: true,
        certificates: {
          include: {
            study: {
              include: {
                specialization: {
                  include: {
                    specializationDirection: true,
                    specializationParameter: true,
                  },
                },
              },
            },
          },
        },
        studies: {
          include: {
            specialization: {
              include: {
                specializationDirection: true,
                specializationParameter: true,
              },
            },
            protocol: true,
            workspace: { include: { company: true } },
          },
        },
        passports: true,
        snilses: true,
        diplomas: true,
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

    const validatedData = await validateObject(
      EmployeeRequestSchema,
      entityToSave
    )

    // Получаем существующую запись, чтобы понять что делать с удостоверениями
    const existingData = await prisma.employee.findFirst({
      where: { id: employeeId },
      include: {
        berth: { include: { berthType: true } },
        department: true,
        studies: {
          include: {
            specialization: {
              include: {
                specializationDirection: true,
                specializationParameter: true,
              },
            },
          },
        },
        passports: true,
        snilses: true,
        diplomas: true,
      },
    })

    // ПАСПОРТА
    // Новые паспорта
    const passportsToCreate = validatedData.passports?.filter(
      (item) => !item.id
    )
    // Паспорта для обновления
    const passportsToUpdate = validatedData.passports?.filter((item) => item.id)
    const existingPassportsIds =
      existingData?.passports?.map((item) => item.id) || []
    const providedPassportsIds = passportsToUpdate?.map((item) => item.id!)
    // Паспорта для удаления
    const passportsToDelete = existingPassportsIds.filter(
      (id) => !providedPassportsIds?.includes(id!)
    )

    // СНИЛСЫ
    // Новые СНИЛСы
    const snilsesToCreate = validatedData.snilses?.filter((item) => !item.id)
    // СНИЛСы для обновления
    const snilsesToUpdate = validatedData.snilses?.filter((item) => item.id)
    const existingSnilsesIds =
      existingData?.snilses?.map((item) => item.id) || []
    const providedSnilsesIds = snilsesToUpdate?.map((item) => item.id!)
    // СНИЛСы для удаления
    const snilsesToDelete = existingSnilsesIds.filter(
      (id) => !providedSnilsesIds?.includes(id!)
    )

    // ДИПЛОМЫ
    // Новые дипломы
    const diplomasToCreate = validatedData.diplomas?.filter((item) => !item.id)
    // Дипломы для обновления
    const diplomasToUpdate = validatedData.diplomas?.filter((item) => item.id)
    const existingDiplomasIds =
      existingData?.diplomas?.map((item) => item.id) || []
    const providedDiplomasIds = diplomasToUpdate?.map((item) => item.id!)
    // Дипломы для удаления
    const diplomasToDelete = existingDiplomasIds.filter(
      (id) => !providedDiplomasIds?.includes(id!)
    )

    const updatedData = await prisma.employee.update({
      data: {
        surname: validatedData.surname,
        name: validatedData.name ?? null,
        patronymic: validatedData.patronymic ?? null,
        birthDate: validatedData.birthDate ?? null,
        hireDate: validatedData.hireDate ?? null,
        firedDate: validatedData.firedDate ?? null,
        phoneNumber: validatedData.phoneNumber ?? null,
        email: validatedData.email ?? null,
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
        passports: {
          create:
            passportsToCreate && passportsToCreate.length > 0
              ? passportsToCreate.map((item) => {
                  return {
                    series: item.series,
                    number: item.number,
                    birthDate: item.birthDate ?? Prisma.skip,
                    birthPlace: item.birthPlace ?? Prisma.skip,
                    issuedBy: item.issuedBy ?? Prisma.skip,
                    issueDate: item.issueDate ?? Prisma.skip,
                    subdivisionCode: item.subdivisionCode ?? Prisma.skip,
                    workspace: {
                      connect: { id: id },
                    },
                  }
                })
              : Prisma.skip,
          update:
            passportsToUpdate && passportsToUpdate.length > 0
              ? passportsToUpdate.map((item) => {
                  return {
                    data: {
                      series: item.series,
                      number: item.number,
                      birthDate: item.birthDate ?? Prisma.skip,
                      birthPlace: item.birthPlace ?? Prisma.skip,
                      issuedBy: item.issuedBy ?? Prisma.skip,
                      issueDate: item.issueDate ?? Prisma.skip,
                      subdivisionCode: item.subdivisionCode ?? Prisma.skip,
                    },
                    where: { id: item.id! },
                  }
                })
              : Prisma.skip,
          delete:
            passportsToDelete && passportsToDelete.length > 0
              ? passportsToDelete.map((itemId) => ({ id: itemId }))
              : Prisma.skip,
        },
        snilses: {
          create:
            snilsesToCreate && snilsesToCreate.length > 0
              ? snilsesToCreate.map((item) => {
                  return {
                    number: item.number,
                    workspace: {
                      connect: { id: id },
                    },
                  }
                })
              : Prisma.skip,
          update:
            snilsesToUpdate && snilsesToUpdate.length > 0
              ? snilsesToUpdate.map((item) => {
                  return {
                    data: {
                      number: item.number,
                    },
                    where: { id: item.id! },
                  }
                })
              : Prisma.skip,
          delete:
            snilsesToDelete && snilsesToDelete.length > 0
              ? snilsesToDelete.map((itemId) => ({ id: itemId }))
              : Prisma.skip,
        },
        diplomas: {
          create:
            diplomasToCreate && diplomasToCreate.length > 0
              ? diplomasToCreate.map((item) => {
                  return {
                    series: item.series,
                    number: item.number,
                    workspace: {
                      connect: { id: id },
                    },
                  }
                })
              : Prisma.skip,
          update:
            diplomasToUpdate && diplomasToUpdate.length > 0
              ? diplomasToUpdate.map((item) => {
                  return {
                    data: {
                      series: item.series,
                      number: item.number,
                    },
                    where: { id: item.id! },
                  }
                })
              : Prisma.skip,
          delete:
            diplomasToDelete && diplomasToDelete.length > 0
              ? diplomasToDelete.map((itemId) => ({ id: itemId }))
              : Prisma.skip,
        },
      },
      where: { id: employeeId },
      include: {
        berth: { include: { berthType: true } },
        department: true,
        studies: {
          include: {
            specialization: {
              include: {
                specializationDirection: true,
                specializationParameter: true,
              },
            },
          },
        },
        passports: true,
        snilses: true,
        diplomas: true,
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
