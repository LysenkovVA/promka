"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)"
import { validateObject } from "@/lib/zod/validateObject"
import { prisma } from "@workspace/database/prisma"
import { Employee } from "../../../../../model/types/employee.schema"
import { Prisma } from "@workspace/database/.generated/client"
import { ServerError } from "@/lib/responses/ServerError"
import { EmployeeRequestSchema } from "../../../../../model/types/employee-request.schema"

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

    const validatedData = await validateObject(
      EmployeeRequestSchema,
      entityToSave
    )

    const createdData = await prisma.employee.create({
      data: {
        surname: validatedData.surname,
        name: validatedData.name ?? Prisma.skip,
        patronymic: validatedData.patronymic ?? Prisma.skip,
        birthDate: validatedData.birthDate ?? Prisma.skip,
        hireDate: validatedData.hireDate ?? Prisma.skip,
        firedDate: validatedData.firedDate ?? Prisma.skip,
        phoneNumber: validatedData.phoneNumber ?? Prisma.skip,
        email: validatedData.email ?? Prisma.skip,
        ...(validatedData?.passports && validatedData?.passports?.length > 0
          ? {
              passports: {
                create: validatedData.passports?.map((newPassport) => {
                  return {
                    series: newPassport.series,
                    number: newPassport.number,
                    birthDate: newPassport.birthDate,
                    birthPlace: newPassport.birthPlace,
                    issuedBy: newPassport.issuedBy,
                    issueDate: newPassport.issueDate,
                    subdivisionCode: newPassport.subdivisionCode,
                    workspace: {
                      connect: { id: id },
                    },
                  }
                }),
              },
            }
          : Prisma.skip),
        ...(validatedData?.snilses && validatedData?.snilses?.length > 0
          ? {
              snilses: {
                create: validatedData.snilses?.map((newSnils) => {
                  return {
                    number: newSnils.number,
                    workspace: {
                      connect: { id: id },
                    },
                  }
                }),
              },
            }
          : Prisma.skip),
        ...(validatedData?.diplomas && validatedData?.diplomas?.length > 0
          ? {
              diplomas: {
                create: validatedData.diplomas?.map((newDiploma) => {
                  return {
                    series: newDiploma.series,
                    number: newDiploma.number,
                    workspace: {
                      connect: { id: id },
                    },
                  }
                }),
              },
            }
          : Prisma.skip),
        ...(validatedData.berth?.id && {
          berth: { connect: { id: validatedData.berth?.id } },
        }),
        ...(validatedData.department?.id && {
          department: { connect: { id: validatedData.department?.id } },
        }),
        workspace: {
          connect: { id: id },
        },
      },
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

    // @ts-ignore
    return ResponseData.Ok<Employee>(createdData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
