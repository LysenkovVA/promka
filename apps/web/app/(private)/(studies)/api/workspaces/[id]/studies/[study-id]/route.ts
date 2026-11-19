"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { Study, StudySchema } from "../../../../../model/types/study.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; "study-id": string }> }
): Promise<NextResponse<ResponseData<Study | undefined>>> {
  try {
    const { id, "study-id": studyId } = await props.params

    await checkAuthForWorkspace(id)

    const candidate = await prisma.study.findFirst({
      where: { id: studyId },
      include: {
        specialization: {
          include: {
            specializationDirection: true,
            specializationParameter: true,
          },
        },
        employees: {
          include: {
            berth: { include: { berthType: true } },
            department: true,
          },
        },
        certificates: {
          include: {
            employee: {
              include: {
                berth: { include: { berthType: true } },
                department: true,
              },
            },
          },
        },
        protocol: true,
      },
    })

    if (!candidate)
      return ResponseData.BadRequest(["Обучение не найдено"]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Study>(candidate).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string; "study-id": string }> }
): Promise<NextResponse<ResponseData<Study | undefined>>> {
  try {
    const { id, "study-id": studyId } = await props.params

    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(StudySchema, entityToSave)

    const updatedData = undefined
    // const updatedData = await prisma.study.update({
    //   data: {
    //     number: validatedData.number ?? Prisma.skip,
    //     date: validatedData.date ?? Prisma.skip,
    //     // group: validatedData.group ?? Prisma.skip,
    //     // employee: { connect: { id: validatedData.employee!.id! } },
    //   },
    //   where: { id: studyId },
    //   include: {
    //     study: {
    //       include: {
    //         specialization: {
    //           include: {
    //             specializationDirection: true,
    //             specializationParameter: true,
    //           },
    //         },
    //         protocol: true,
    //       },
    //     },
    //     employee: {
    //       include: {
    //         berth: { include: { berthType: true } },
    //         department: true,
    //       },
    //     },
    //   },
    // })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные обучения не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Study>(updatedData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string; "study-id": string }> }
): Promise<NextResponse<ResponseData<Study | undefined>>> {
  try {
    const { id, "study-id": studyId } = await props.params

    await checkAuthForWorkspace(id)

    const deletedBerth = await prisma.study.delete({
      where: { id: studyId },
    })

    // @ts-ignore
    return ResponseData.Ok<Study>(deletedBerth).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
