import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ResponseData } from "@/lib/responses/ResponseData"
import {
  createAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/jose/client/tokens"
import dayjs from "dayjs"

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

  // Признак API-запроса
  const isApiRoute = pathname.startsWith("/api")
  // Признак публичного маршрута
  const isPublicPath = publicPaths.includes(pathname)

  // 🔓 Публичные маршруты — разрешаем
  if (isPublicPath || isApiRoute) {
    return NextResponse.next()
  }

  // 🍪 Получаем токены
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  // ✅ Если есть access token — пропускаем
  if (accessToken) {
    const verifiedAccessToken = await verifyAccessToken(accessToken)

    if (verifiedAccessToken) {
      console.log("[middleware] Access token валиден")
      return NextResponse.next()
    }
  }

  // ❌ Нет access token
  console.error(
    `[${dayjs().format("HH:mm:ss")}][SERVER][middleware][${request.method}][Access token отсутствует][${pathname}]`
  )

  const refreshToken = cookieStore.get("refreshToken")?.value

  if (!refreshToken) {
    await clearSession()

    if (isApiRoute) {
      // 🚫 API: Возвращаем 401, НЕ делаем редирект
      console.error(`[middleware] API: Refresh token отсутствует → 401`)
      return ResponseData.NotAuthorized([
        "Требуется авторизация",
      ]).toNextResponse()
    } else {
      // 🌐 Страница: Делаем редирект на /
      console.error(`[middleware] Страница: Redirect to /`)
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  // 🔄 Есть refresh token — пробуем обновить
  const session = await verifyRefreshToken(refreshToken)

  if (!session) {
    await clearSession()

    if (isApiRoute) {
      // 🚫 API: Возвращаем 401
      console.error(`[middleware] API: Refresh token недействителен → 401`)
      return ResponseData.NotAuthorized(["Сессия истекла"]).toNextResponse()
    } else {
      // 🌐 Страница: Редирект на /
      console.error(
        `[middleware] Страница: Refresh token недействителен → Redirect to /`
      )
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  // ✅ Успешно обновили сессию — устанавливаем новый access token
  const expiresInAccess = new Date(
    Date.now() + Number(process.env.ACCESS_TOKEN_LIVE_NUMBER)
  )
  const encryptedSessionAccessToken = await createAccessToken(session)

  const response = isApiRoute
    ? NextResponse.next() // Для API — не редиректим, просто добавляем куку
    : NextResponse.redirect(request.url) // Для страниц — редиректим, чтобы следующий запрос был с новой кукой

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
// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// }
export const config = {
  matcher: [
    /*
     * Исключаем:
     * - все файлы внутри _next (статика, изображения Next.js)
     * - favicon, sitemap, robots.txt
     * - любые расширения вроде .png, .jpg, .svg, .css, .js
     */
    "/((?!_next|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|css|js)).*)",
  ],
}

// import { NextRequest, NextResponse } from "next/server"
// import dayjs from "dayjs"
// import { cookies } from "next/headers"
// import { ResponseData } from "@/lib/responses/ResponseData"
// import { createAccessToken, verifyRefreshToken } from "@/lib/jose/client/tokens"
//
// const publicPaths = ["/", "/api/login", "/api/refresh"]
//
// async function clearSession() {
//   try {
//     const c = await cookies()
//     c.getAll().forEach((cookie) => c.delete(cookie.name))
//     console.log(
//       `[middleware][${dayjs(Date.now()).format("HH:mm:ss")}][Пользователь завершил сеанс. Данные сессии очищены. Файлы cookie удалены.]`
//     )
//   } catch (error) {
//     console.error(ResponseData.InternalServerError(error).getAllErrors())
//   }
// }
//
// /**
//  *‼️Здесь проверяются только страницы!
//  * Api проверяется и обновляется в axios!
//  * @param request
//  */
// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl
//
//   // Публичные маршруты — разрешаем
//   if (publicPaths.some((path) => pathname === path)) {
//     console.log(
//       `[${dayjs().format("HH:mm:ss")}][SERVER][middleware][${request.method}][Публичный маршрут][${pathname}]`
//     )
//     return NextResponse.next()
//   }
//
//   /**
//    *  Остальные приватные маршруты
//    */
//   const cookieStore = await cookies()
//   const accessToken = cookieStore.get("accessToken")?.value
//
//   if (!accessToken) {
//     console.error(
//       `[${dayjs().format("HH:mm:ss")}][SERVER][middleware][${request.method}][Access token истек][${pathname}]`
//     )
//
//     const refreshToken = cookieStore.get("refreshToken")?.value
//
//     if (!refreshToken) {
//       await clearSession()
//       console.error(
//         `[${dayjs().format("HH:mm:ss")}][SERVER][middleware][${request.method}][Refresh token не найден. Redirect to login][${pathname}]`
//       )
//       const url = request.nextUrl.clone()
//       url.pathname = "/"
//       return NextResponse.redirect(url)
//
//       // return ResponseData.Forbidden(["Доступ запрещен"]).toNextResponse()
//     } else {
//       const session = await verifyRefreshToken(refreshToken)
//
//       if (!session) {
//         await clearSession()
//         console.error(
//           `[${dayjs().format("HH:mm:ss")}][SERVER][middleware][${request.method}][Refresh token истек. Redirect to login][${pathname}]`
//         )
//         const url = request.nextUrl.clone()
//         url.pathname = "/"
//         return NextResponse.redirect(url)
//         return ResponseData.Forbidden(["Доступ запрещен"]).toNextResponse()
//       } else {
//         const expiresInAccess = new Date(
//           Date.now() + Number(process.env.ACCESS_TOKEN_LIVE_NUMBER)
//         )
//
//         const encryptedSessionAccessToken = await createAccessToken(session)
//
//         // Создаём новый ответ на основе оригинального запроса
//         // const response = NextResponse.next()
//         // Создаём redirect response, чтобы следующий запрос уже содержал куки
//         const redirectUrl = request.nextUrl.clone()
//         const response = NextResponse.redirect(redirectUrl)
//
//         // response.cookies.delete("accessToken")
//
//         // Вариант 1: Установить токен в заголовок Authorization (если клиент читает из ответа)
//         // Это нестандартно для браузера, но может быть полезно для API
//         //         response.headers.set('Authorization', `Bearer ${encryptedSessionAccessToken}`)
//
//         // Вариант 2 (рекомендуется): Установить токен в cookie
//         response.cookies.set("accessToken", encryptedSessionAccessToken, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           expires: expiresInAccess,
//           sameSite: "lax",
//           path: "/",
//         })
//
//         console.log(
//           `[${dayjs().format("HH:mm:ss")}][SERVER][middleware][${request.method}][Новый access token установлен в запрос][${pathname}]`
//         )
//
//         return response
//       }
//     }
//   }
//   // Access токен валиден — пропускаем
//   else {
//     console.log(
//       `[${dayjs().format("HH:mm:ss")}][SERVER][middleware][${request.method}][Приватный маршрут разрешен][${pathname}]`
//     )
//
//     return NextResponse.next()
//   }
//
//   // // Смотрим наличие
//   // const authHeader = request.headers.get("authorization")
//   // if (!authHeader || !authHeader.startsWith("Bearer ")) {
//   //   return ResponseData.NotAuthorized([
//   //     "Access токен отсутствует (middleware)",
//   //   ]).toNextResponse()
//   // }
//
//   // // Проверяем валидность refresh
//   // if (pathname === "/api/refresh") {
//   //   const cookieStore = await cookies()
//   //   const refreshToken = cookieStore.get("refreshToken")?.value
//   //
//   //   if (!refreshToken) {
//   //     console.error(`Refresh токен отсутствует (middleware)`)
//   //     return ResponseData.NotAuthorized([
//   //       "Refresh токен отсутствует",
//   //     ]).toNextResponse()
//   //   }
//   //
//   //   const sessionData = await verifyRefreshToken(refreshToken)
//   //
//   //   if (!sessionData) {
//   //     await clearSession()
//   //     console.error(`Время жизни refresh токена истекло (middleware)`)
//   //     return ResponseData.NotAuthorized([
//   //       "Время жизни refresh токена истекло",
//   //     ]).toNextResponse()
//   //   }
//   //
//   //   return NextResponse.next()
//   // } else {
//   //   // TODO Если приватный маршрут, проверяем access токен
//   //   const authHeader = request.headers.get("authorization")
//   //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//   //     return ResponseData.NotAuthorized([
//   //       "Access токен отсутствует (middleware)",
//   //     ]).toNextResponse()
//   //   }
//   //
//   //   const token = authHeader.split(" ")[1]
//   //   if (!token) {
//   //     return ResponseData.NotAuthorized([
//   //       "Access токен отсутствует",
//   //     ]).toNextResponse()
//   //   }
//   //
//   //   const sessionData = await verifyAccessToken(token)
//   //
//   //   if (!sessionData) {
//   //     return ResponseData.NotAuthorized([
//   //       "Access token не действителен",
//   //     ]).toNextResponse()
//   //   }
//
//   // Всё ок — пропускаем
//
//   // return NextResponse.next()
// }
//
// /**
//  * API не попадет в middleware
//  */
// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// }
