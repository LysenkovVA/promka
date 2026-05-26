"use client"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Field, FieldGroup } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux"
import { loginThunk } from "@/app/(auth)/model/thunks/loginThunk"
import { getUserAuthDataError } from "@/app/(auth)/model/selectors/authSelectors"
import { toast } from "sonner"

export default function Page() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useAppDispatch()
  const error = useAppSelector(getUserAuthDataError)

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center" })
    }
  }, [error])

  const submitDisabled = useMemo(() => {
    return login.length === 0 || password.length === 0
  }, [login.length, password.length])

  const onLogin = useCallback(async () => {
    try {
      setIsSubmitting(true)
      await dispatch(loginThunk({ email: login, password }))
      // console.log("Login successful")
    } finally {
      setIsSubmitting(false)
    }
  }, [dispatch, login, password])

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <form>
        <CardHeader style={{ textAlign: "center", paddingBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/logo.png" // Убедитесь, что файл находится в public/logo.png
              alt="Логотип"
              loading={"eager"}
              width={70}
              height={70}
              style={{ objectFit: "contain" }}
            />
          </div>
          {/* При необходимости можно добавить заголовок */}
          <CardTitle>{"Авторизация".toUpperCase()}</CardTitle>
        </CardHeader>
        <Card
          style={{
            margin: 16,
            width: "90%",
            maxWidth: 400,
            minWidth: 300,
          }}
        >
          <CardContent>
            <FieldGroup>
              <Field>
                <Input
                  id="email"
                  placeholder="E-mail"
                  required
                  onChange={(e) => setLogin(e.target.value)}
                />
              </Field>
              <Field>
                <Input
                  id="password"
                  placeholder="Пароль"
                  type={"password"}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <Button
              style={{ width: "100%" }}
              type={"submit"}
              onClick={async (e) => {
                e.preventDefault()
                await onLogin()
              }}
              disabled={submitDisabled || isSubmitting}
            >
              {isSubmitting ? "Вход..." : "Войти"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
