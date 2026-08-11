import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ResponseData } from "@/lib/responses/ResponseData"
import {
  createAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/jose/client/tokens"

const publicPaths = ["/", "/register", "/api/login", "/api/refresh"]

async function clearSession() {
  try {
    const c = await cookies()
    c.getAll().forEach((cookie) => c.delete(cookie.name))
  } catch (error) {
    console.error(ResponseData.InternalServerError(error).getAllErrors())
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 🔓 Публичные маршруты — разрешаем
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // 🍪 Получаем токены
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  // ✅ Если есть access token — пропускаем
  if (accessToken) {
    const verifiedAccessToken = await verifyAccessToken(accessToken)

    if (verifiedAccessToken) {
      return NextResponse.next()
    }
  }

  const refreshToken = cookieStore.get("refreshToken")?.value

  if (!refreshToken) {
    await clearSession()

    // 🌐 Страница: Делаем редирект на /
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  // 🔄 Есть refresh token — пробуем обновить
  const session = await verifyRefreshToken(refreshToken)

  if (!session) {
    await clearSession()

    // 🌐 Страница: Редирект на /
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  // ✅ Успешно обновили сессию — устанавливаем новый access token
  const expiresInAccess = new Date(
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    Date.now() + Number(process.env.ACCESS_TOKEN_LIVE_NUMBER)
  )
  const encryptedSessionAccessToken = await createAccessToken(session)

  // Для страниц — редиректим, чтобы следующий запрос был с новой кукой
  const response = NextResponse.redirect(request.url)

  response.cookies.set("accessToken", encryptedSessionAccessToken, {
    httpOnly: true,
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    secure: process.env.NODE_ENV === "production",
    expires: expiresInAccess,
    sameSite: "lax",
    path: "/",
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match всех путей, КРОМЕ:
     * - /api/(.*)
     * - статика (_next, favicon, sitemap, robots.txt)
     * - файлы (.png, .jpg, .css, .js и т.д.)
     */
    "/((?!api|_next|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|css|js)).*)",
  ],
}
