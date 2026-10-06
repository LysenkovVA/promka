import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ServerError } from "@/lib/responses/ServerError"

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
    return ServerError.toNextResponse(error)
  }
}
