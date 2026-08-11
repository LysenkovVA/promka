"use server"

import { NextRequest, NextResponse } from "next/server"
import { upsertCompany } from "./actions/upsert-company"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ICompanyEntity } from "@/app/(private)/(companies)"
import { getSessionData } from "@/lib/jose/server/cookies"

export async function POST(
  request: NextRequest
): Promise<NextResponse<ResponseData<ICompanyEntity | undefined>>> {
  try {
    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    // TODO получаем юзера из cookies
    const sessionData = await getSessionData()
    if (!sessionData) {
      throw new Error("Не удалось проверить данные сессии")
    }

    const upsertedData = await upsertCompany(entityToSave, sessionData.user.id)

    return upsertedData.toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
