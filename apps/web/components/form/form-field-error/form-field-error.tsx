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
      className={`w-full ${withBorder ? "border-destructive p-1.5" : "border-0 pt-0 pr-1.5 pb-0 pl-1.5"}`}
      variant={"destructive"}
    >
      <div className={"flex w-full items-center justify-start gap-1"}>
        {" "}
        <IconAlertSquareRounded className={"size-4"} />
        <AlertTitle>{message}</AlertTitle>
      </div>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  )
})
