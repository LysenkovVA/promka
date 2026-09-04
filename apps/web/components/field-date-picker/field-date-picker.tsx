"use client"

import * as React from "react"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import { Button } from "@workspace/ui/components/button"
import { stripTimezone } from "@/lib/date/utils"

export interface FieldDatePickerProps {
  label: string
  id: string
  value?: Date | undefined
  onChange?: (value: Date | undefined) => void
}

export const FieldDatePicker = (props: FieldDatePickerProps) => {
  const { label, value, onChange, id } = props

  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(value ?? undefined)

  React.useEffect(() => {
    setDate(value ?? undefined)
  }, [value])

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className="justify-start font-normal"
          >
            {date ? date?.toLocaleDateString() : "Выберите дату"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <Calendar
            className={"w-full"}
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            onSelect={(selectedDate) => {
              if (selectedDate) {
                // Сбрасываем время при выборе даты, используем UTC
                const cleanedDate = stripTimezone(selectedDate)
                setDate(cleanedDate)
                onChange?.(cleanedDate)
              } else {
                setDate(undefined)
                onChange?.(undefined)
              }
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
