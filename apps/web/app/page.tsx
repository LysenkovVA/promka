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
import { toast } from "sonner"
import Image from "next/image"

export default function Page() {
  return (
    <div
      style={{
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
              width={60}
              height={60}
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
                <Input id="login" placeholder="Логин" required />
              </Field>
              <Field>
                <Input
                  id="password"
                  placeholder="Пароль"
                  type={"password"}
                  required
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
              onClick={() => {
                toast("Кнопка нажата", { position: "top-center" })
              }}
            >
              Войти
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
