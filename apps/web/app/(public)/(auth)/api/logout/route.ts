import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ResponseData } from "@/lib/responses/ResponseData"

/**
 * Обновление access token
 * @param request
 * @constructor
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    cookieStore.getAll().forEach((cookie) => cookieStore.delete(cookie.name))

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
