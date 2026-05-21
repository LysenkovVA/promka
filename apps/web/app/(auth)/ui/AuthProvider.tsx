"use client"

import { ReactNode, useEffect } from "react"

import {
  getAuthDataUser,
  getUserAuthDataIsInitialized,
} from "../model/selectors/authSelectors"
import { useAppDispatch, useAppSelector } from "@/lib/redux"
import { usePathname, useRouter } from "next/navigation"
import { refreshThunk } from "@/app/(auth)/model/thunks/refreshThunk"
import { toast } from "sonner"

/**
 * Провайдер, который получает авторизованного пользователя при обновлении страницы
 * и устанавливает AuthSchema в глобальное состояние
 * @param children
 * @constructor
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // console.log("🎮 AuthProvider отрисован")
  const authUser = useAppSelector(getAuthDataUser)
  const isInitialized = useAppSelector(getUserAuthDataIsInitialized)

  const router = useRouter()
  const path = usePathname()
  const dispatch = useAppDispatch()

  /**
   * Должен отрабатывать только один раз!
   */
  useEffect(() => {
    if (!isInitialized) {
      // console.log("🔁 Запускаем refresh")
      try {
        dispatch(refreshThunk()).then((result) => {
          // console.log("refresh thunk successful")
        })
      } catch (error) {
        console.error("Error in AuthProvider:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (authUser && authUser.id && path === "/") {
      if (process.env.NEXT_PUBLIC_DEFAULT_PRIVATE_URL) {
        router.push(process.env.NEXT_PUBLIC_DEFAULT_PRIVATE_URL)
      } else {
        toast.error(
          "Адрес по умолчанию для авторизованного пользователя не задан"
        )
      }
    }
  }, [authUser, path, router])

  return <div>{children}</div>
}
