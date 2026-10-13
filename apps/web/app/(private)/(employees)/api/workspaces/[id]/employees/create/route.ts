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
import { ServerError } from "@/lib/responses/ServerError"

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
        patronymic: validatedData.patronymic ?? Prisma.skip,
        birthDate: validatedData.birthDate ?? Prisma.skip,
        snils: validatedData.snils ?? Prisma.skip,
        hireDate: validatedData.hireDate ?? Prisma.skip,
        firedDate: validatedData.firedDate ?? Prisma.skip,
        phoneNumber: validatedData.phoneNumber ?? Prisma.skip,
        email: validatedData.email ?? Prisma.skip,
        workspace: {
          connect: { id: id },
        },
        ...(validatedData.berth?.id && {
          berth: { connect: { id: validatedData.berth?.id } },
        }),
        ...(validatedData.department?.id && {
          department: { connect: { id: validatedData.department?.id } },
        }),
        certificates: {
          create: validatedData.certificates
            ? validatedData.certificates.map((item) => {
                return {
                  certificateType: {
                    connect: { id: item.certificateType.id! },
                  },
                  number: item.number,
                  date: item.date ?? Prisma.skip,
                  group: item.group ?? Prisma.skip,
                  workspace: {
                    connect: { id: id },
                  },
                }
              })
            : Prisma.skip,
        },
      },
      include: {
        workspace: { include: { company: true } },
        berth: true,
        department: true,
        certificates: { include: { certificateType: true } },
      },
    })

    // @ts-ignore
    return ResponseData.Ok<Employee>(createdData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
