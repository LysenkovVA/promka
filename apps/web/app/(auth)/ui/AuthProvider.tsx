"use client"

/**
 * Провайдер, который получает авторизованного пользователя при обновлении страницы
 * и устанавливает AuthSchema в глобальное состояние
 */

import { ReactNode, useEffect } from "react"

import {
  getAuthDataUser,
  getUserAuthDataError,
  getUserAuthDataIsInitialized,
} from "../model/selectors/authSelectors"
import { useAppDispatch, useAppSelector } from "@/lib/redux"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { refreshThunk } from "@/app/(auth)/model/thunks/refreshThunk"

export function AuthProvider({ children }: { children: ReactNode }) {
  const authUser = useAppSelector(getAuthDataUser)
  const error = useAppSelector(getUserAuthDataError)
  const isInitialized = useAppSelector(getUserAuthDataIsInitialized)

  const router = useRouter()
  const path = usePathname()
  const dispatch = useAppDispatch()

  /**
   * Должен отрабатывать только один раз!!!!
   * Не писать зависимые эффекты в useEffect
   */
  useEffect(() => {
    if (!isInitialized) {
      dispatch(refreshThunk())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Отображение ошибки
   */
  useEffect(() => {
    if (error) {
      toast.error(`${error}`, {
        position: "top-center",
        description: "Ошибка в AuthProvider",
      })
    }
  }, [error])

  /**
   * Обработка редиректов
   */
  useEffect(() => {
    if (authUser && authUser.id && path === "/") {
      if (process.env.NEXT_PUBLIC_DEFAULT_PRIVATE_URL) {
        router.push(process.env.NEXT_PUBLIC_DEFAULT_PRIVATE_URL)
      } else {
        toast.error(
          "Адрес по умолчанию для авторизованного пользователя не удалось прочитать из .env файла"
        )
      }
    } else {
      if (!authUser?.id) {
        if (process.env.NEXT_PUBLIC_PATH) {
          router.push(process.env.NEXT_PUBLIC_PATH)
        } else {
          toast.error(
            "Адрес страницы логина не удалось прочитать из .env файла"
          )
        }
      }
    }
  }, [authUser, isInitialized, path, router])

  return <div>{children}</div>
}
