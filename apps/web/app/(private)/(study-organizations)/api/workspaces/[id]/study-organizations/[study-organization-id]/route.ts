"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)"
import { prisma } from "@workspace/database/prisma"
import { validateObject } from "@/lib/zod/validateObject"
import { Prisma } from "@workspace/database/.generated/client"
import {
  StudyOrganization,
  StudyOrganizationSchema,
} from "../../../../../model/types/study-organization.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; "study-organization-id": string }> }
): Promise<NextResponse<ResponseData<StudyOrganization | undefined>>> {
  try {
    const { id, "study-organization-id": studyOrganizationId } =
      await props.params

    await checkAuthForWorkspace(id)

    const candidate = await prisma.studyOrganization.findFirst({
      where: { id: studyOrganizationId },
    })

    if (!candidate)
      return ResponseData.BadRequest([
        "Образовательная организация не найдена",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<StudyOrganization>(candidate).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string; "study-organization-id": string }> }
): Promise<NextResponse<ResponseData<StudyOrganization | undefined>>> {
  try {
    const { id, "study-organization-id": studyOrganizationId } =
      await props.params

    await checkAuthForWorkspace(id)

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(
      StudyOrganizationSchema,
      entityToSave
    )

    const updatedData = await prisma.studyOrganization.update({
      data: {
        name: validatedData.name ?? Prisma.skip,
      },
      where: { id: studyOrganizationId },
    })

    if (!updatedData)
      return ResponseData.BadRequest([
        "Данные образовательной организации не обновлены",
      ]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<StudyOrganization>(updatedData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string; "study-organization-id": string }> }
): Promise<NextResponse<ResponseData<StudyOrganization | undefined>>> {
  try {
    const { id, "study-organization-id": studyOrganizationId } =
      await props.params

    await checkAuthForWorkspace(id)

    const deletedBerth = await prisma.studyOrganization.delete({
      where: { id: studyOrganizationId },
    })

    // @ts-ignore
    return ResponseData.Ok<StudyOrganization>(deletedBerth).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
