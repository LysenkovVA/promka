import { jwtVerify, SignJWT } from "jose"
import { SessionData } from "../types/sessionData"

/**
 * Создание access token
 * @param payload
 */
export async function createAccessToken(payload: any): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(String(process.env.ACCESS_TOKEN_LIVE))
    .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET))
}

/**
 * Проверка access token
 * @param token
 */
export async function verifyAccessToken(
  token: string
): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET),
      {
        algorithms: ["HS256"],
      }
    )
    return payload as SessionData
  } catch {
    return null
  }
}

/**
 * Создание refresh token
 * @param payload
 */
export async function createRefreshToken(payload: any): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(String(process.env.REFRESH_TOKEN_LIVE))
    .sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET))
}

/**
 * Проверка refresh token
 * @param token
 */
export async function verifyRefreshToken(
  token: string
): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET),
      {
        algorithms: ["HS256"],
      }
    )
    return payload as SessionData
  } catch {
    return null
  }
}
