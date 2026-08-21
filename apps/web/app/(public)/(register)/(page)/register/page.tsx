"use client"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import Image from "next/image"
import { Field, FieldGroup } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { useMemo, useState } from "react"
import { useAppDispatch } from "@/lib/redux"

export default function RegistrationPage() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useAppDispatch()

  const submitDisabled = useMemo(() => {
    return login.length === 0 || password.length === 0
  }, [login.length, password.length])

  // const onRegisterUser = useCallback(async () => {
  //   const result = await dispatch(
  //     upsertUserThunk({
  //       entityData: {
  //         email: login,
  //         hashedPassword: bcrypt.hashSync(password, 10),
  //         emailConfirmed: false,
  //         phoneNumberConfirmed: false,
  //       },
  //     })
  //   )
  //
  //   if (result.meta.requestStatus === "fulfilled") {
  //     toast.success("Пользователь зарегистрирован!", { position: "top-center" })
  //     return true
  //   } else {
  //     toast.error(JSON.stringify(result.payload))
  //   }
  // }, [dispatch, login, password])

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
          <CardTitle>{"Регистрация пользователя".toUpperCase()}</CardTitle>
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
                // await onRegisterUser()
              }}
              disabled={submitDisabled || isSubmitting}
            >
              {isSubmitting ? "Регистрация..." : "Создать"}
            </Button>
            <a href={"/"}>Авторизация</a>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
