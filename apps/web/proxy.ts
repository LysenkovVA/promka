import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ResponseData } from "@/lib/responses/ResponseData"
import {
  createAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/jose/client/tokens"

const publicPaths = ["/", "/api/login", "/api/refresh"]

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

  // // Признак API-запроса
  // const isApiRoute = pathname.startsWith("/api")
  // // Признак публичного маршрута
  // const isPublicPath = publicPaths.includes(pathname)

  // 🔓 Публичные маршруты — разрешаем
  if (publicPaths.includes(pathname)) {
    // console.warn(
    //   `[${dayjs().format("HH:mm:ss")}][middleware] Публичный маршрут: ${pathname}`
    // )
    return NextResponse.next()
  }

  // console.log(
  //   `[${dayjs().format("HH:mm:ss")}][SERVER][middleware][${request.method}][НЕ Публичный маршрут][${pathname}]`
  // )

  // 🍪 Получаем токены
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  // ✅ Если есть access token — пропускаем
  if (accessToken) {
    const verifiedAccessToken = await verifyAccessToken(accessToken)

    if (verifiedAccessToken) {
      // console.log("[middleware] Access token валиден")
      return NextResponse.next()
    }
  }

  // // ❌ Нет access token
  // console.error(
  //   `[${dayjs().format("HH:mm:ss")}][SERVER][middleware][${request.method}][Access token отсутствует][${pathname}]`
  // )

  const refreshToken = cookieStore.get("refreshToken")?.value

  if (!refreshToken) {
    await clearSession()

    // 🌐 Страница: Делаем редирект на /
    // console.error(`[middleware] Страница: Redirect to /`)
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)

    // if (isApiRoute) {
    //   // 🚫 API: Возвращаем 401, НЕ делаем редирект
    //   console.error(`[middleware] API: Refresh token отсутствует → 401`)
    //   return ResponseData.NotAuthorized([
    //     "Требуется авторизация",
    //   ]).toNextResponse()
    // } else {
    //   // 🌐 Страница: Делаем редирект на /
    //   console.error(`[middleware] Страница: Redirect to /`)
    //   const url = request.nextUrl.clone()
    //   url.pathname = "/"
    //   return NextResponse.redirect(url)
    // }
  }

  // 🔄 Есть refresh token — пробуем обновить
  const session = await verifyRefreshToken(refreshToken)

  if (!session) {
    await clearSession()

    // 🌐 Страница: Редирект на /
    // console.error(
    //   `[middleware] Страница: Refresh token недействителен → Redirect to /`
    // )
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)

    // if (isApiRoute) {
    //   // 🚫 API: Возвращаем 401
    //   console.error(`[middleware] API: Refresh token недействителен → 401`)
    //   return ResponseData.NotAuthorized(["Сессия истекла"]).toNextResponse()
    // } else {
    //   // 🌐 Страница: Редирект на /
    //   console.error(
    //     `[middleware] Страница: Refresh token недействителен → Redirect to /`
    //   )
    //   const url = request.nextUrl.clone()
    //   url.pathname = "/"
    //   return NextResponse.redirect(url)
    // }
  }

  // ✅ Успешно обновили сессию — устанавливаем новый access token
  const expiresInAccess = new Date(
    Date.now() + Number(process.env.ACCESS_TOKEN_LIVE_NUMBER)
  )
  const encryptedSessionAccessToken = await createAccessToken(session)

  // const response = isApiRoute
  //   ? NextResponse.next() // Для API — не редиректим, просто добавляем куку
  //   : NextResponse.redirect(request.url) // Для страниц — редиректим, чтобы следующий запрос был с новой кукой

  // Для страниц — редиректим, чтобы следующий запрос был с новой кукой
  const response = NextResponse.redirect(request.url)

  response.cookies.set("accessToken", encryptedSessionAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresInAccess,
    sameSite: "lax",
    path: "/",
  })

  return response
}

// ⚠️ Middleware применяется ко всем путям, кроме статики
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
