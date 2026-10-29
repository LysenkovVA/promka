"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { Workspace } from "../../../model/types/workspace.schema"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { ServerError } from "@/lib/responses/ServerError"
import { Employee } from "@/Employees"
import { validateObject } from "@/lib/zod/validateObject"
import { WorkspaceRequestSchema } from "@/Workspaces/model/types/workspace-request.schema"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Workspace | undefined>>> {
  try {
    const { id } = await props.params

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const candidate = await prisma.workspace.findFirst({
      where: { id },
      include: {
        teamMembers: {
          include: {
            user: true,
            workspacePermissions: true,
          },
        },
        company: true,
      },
    })

    return ResponseData.Ok<Workspace>(candidate as Workspace).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Employee | undefined>>> {
  try {
    const { id } = await props.params

    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(
      WorkspaceRequestSchema,
      entityToSave
    )

    // Обновляем название фирмы
    const updatedCompany = await prisma.company.update({
      data: {
        name: validatedData.company.name,
      },
      where: { id: validatedData.company.id! },
    })

    const updatedData = await prisma.workspace.findFirst({
      where: { id: id },
      include: {
        teamMembers: {
          include: {
            user: true,
            workspacePermissions: true,
          },
        },
        company: true,
      },
    })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные организации не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Workspace>(updatedData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
