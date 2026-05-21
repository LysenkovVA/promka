import { NextRequest } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"

/**
 * Обновление access token
 * @param request
 * @constructor
 */
export async function POST(request: NextRequest) {
  try {
    // const authHeader = request.headers.get("authorization")
    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   return ResponseData.NotAuthorized([
    //     "Требуется авторизация",
    //   ]).toNextResponse()
    // }
    //
    // const token = authHeader.split(" ")[1]
    // if (!token) {
    //   return ResponseData.NotAuthorized(["Токен отсутствует"]).toNextResponse()
    // }
    //
    // const sessionData = await verifyAccessToken(token)
    //
    // if (!sessionData) {
    //   return ResponseData.NotAuthorized([
    //     "Access token не действителен",
    //   ]).toNextResponse()
    // }

    return ResponseData.Ok(true).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
