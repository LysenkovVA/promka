"use server"

import { NextRequest, NextResponse } from "next/server"
import { upsertUser } from "./actions/upsertUser"
import { ResponseData } from "@/lib/responses/ResponseData"
import { IUserEntity } from "@/app/(private)/(users)"

export async function POST(
  request: NextRequest
): Promise<NextResponse<ResponseData<IUserEntity | undefined>>> {
  try {
    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const upsertedData = await upsertUser(entityToSave)
    return upsertedData.toNextResponse()
  } catch (error) {
    // Неизвестная ошибка в роуте
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
