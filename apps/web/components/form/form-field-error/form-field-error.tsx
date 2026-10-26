"use client"

import { memo } from "react"
import { IconAlertSquareRounded } from "@tabler/icons-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"

export interface FormFieldErrorProps {
  message: string
  description?: string
  withBorder?: boolean
}

export const FormFieldError = memo((props: FormFieldErrorProps) => {
  const { message, withBorder = false, description } = props

  return (
    <Alert
      className={`w-full ${withBorder ? "border-destructive" : "border-0 p-0"}`}
      variant={"destructive"}
    >
      <IconAlertSquareRounded />
      <AlertTitle>{message}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  )
})
