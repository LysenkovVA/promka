"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { Prisma } from "@workspace/database/.generated/client"
import { Protocol } from "../../../../../model/types/protocol.schema"
import { ServerError } from "@/lib/responses/ServerError"
import { ProtocolRequestSchema } from "@/Protocols/model/types/protocol-request.schema"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; "protocol-id": string }> }
): Promise<NextResponse<ResponseData<Protocol | undefined>>> {
  try {
    const { id, "protocol-id": protocolId } = await props.params

    await checkAuthForWorkspace(id)

    const candidate = await prisma.protocol.findFirst({
      where: { id: protocolId },
      include: {
        certificates: {
          include: {
            certificateType: true,
            employee: {
              include: {
                berth: { include: { berthType: true } },
                department: true,
              },
            },
          },
        },
      },
    })

    if (!candidate)
      return ResponseData.BadRequest(["Протокол не найден"]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Protocol>(candidate).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string; "protocol-id": string }> }
): Promise<NextResponse<ResponseData<Protocol | undefined>>> {
  try {
    const { id, "protocol-id": protocolId } = await props.params

    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(
      ProtocolRequestSchema,
      entityToSave
    )

    // Получаем существующую запись, чтобы понять что делать с удостоверениями
    const existingData = await prisma.protocol.findFirst({
      where: { id: protocolId },
      include: {
        certificates: {
          include: {
            certificateType: true,
            employee: {
              include: {
                berth: { include: { berthType: true } },
                department: true,
              },
            },
          },
        },
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

    const updatedData = await prisma.protocol.update({
      data: {
        number: validatedData.number ?? Prisma.skip,
        date: validatedData.date ?? Prisma.skip,
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
                    employee: {
                      connect: { id: item.employee.id },
                    },
                    workspace: {
                      connect: { id: id },
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
                      employee: {
                        connect: { id: item.employee.id },
                      },
                    },
                    where: { id: item.id! },
                  }
                })
              : Prisma.skip,
          delete:
            itemsToDelete && itemsToDelete.length > 0
              ? itemsToDelete.map((itemId) => ({ id: itemId }))
              : Prisma.skip,
        },
      },
      where: { id: protocolId },
      include: {
        certificates: {
          include: {
            certificateType: true,
            employee: {
              include: {
                berth: { include: { berthType: true } },
                department: true,
              },
            },
          },
        },
      },
    })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные протокола не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Protocol>(updatedData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string; "protocol-id": string }> }
): Promise<NextResponse<ResponseData<Protocol | undefined>>> {
  try {
    const { id, "protocol-id": protocolId } = await props.params

    await checkAuthForWorkspace(id)

    const deletedBerth = await prisma.protocol.delete({
      where: { id: protocolId },
    })

    // @ts-ignore
    return ResponseData.Ok<Protocol>(deletedBerth).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
