"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { Prisma } from "@workspace/database/.generated/client"
import {
  Department,
  DepartmentSchema,
} from "../../../../../model/types/department.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; "department-id": string }> }
): Promise<NextResponse<ResponseData<Department | undefined>>> {
  try {
    const { id, "department-id": departmentId } = await props.params

    await checkAuthForWorkspace(id)

    const candidate = await prisma.department.findFirst({
      where: { id: departmentId },
      // include: {
      //   workspace: { include: { company: true } },
      // },
    })

    if (!candidate)
      return ResponseData.BadRequest([
        "Подразделение не найдено",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Department>(candidate).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string; "department-id": string }> }
): Promise<NextResponse<ResponseData<Department | undefined>>> {
  try {
    const { id, "department-id": departmentId } = await props.params

    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(DepartmentSchema, entityToSave)

    const updatedData = await prisma.department.update({
      data: {
        name: validatedData.name ?? Prisma.skip,
      },
      where: { id: departmentId },
      // include: {
      //   workspace: { include: { company: true } },
      // },
    })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные подразделения не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Department>(updatedData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string; "department-id": string }> }
): Promise<NextResponse<ResponseData<Department | undefined>>> {
  try {
    const { id, "department-id": departmentId } = await props.params

    await checkAuthForWorkspace(id)

    const deletedBerth = await prisma.department.delete({
      where: { id: departmentId },
    })

    // @ts-ignore
    return ResponseData.Ok<Department>(deletedBerth).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
