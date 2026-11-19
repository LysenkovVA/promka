"use client"

import * as React from "react"
import { memo, ReactNode } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import { Button } from "@workspace/ui/components/button"
import { stripTimezone } from "@/lib/date/utils"
import { FieldPath, FieldValues, useFormContext } from "react-hook-form"
import { IconChevronDown } from "@tabler/icons-react"
import dayjs from "dayjs"
import { ru } from "react-day-picker/locale"
import { FieldInputProps } from "@/components/form/field-input/field-input"
import { FormControl } from "@/components/form/form-control/form-control"

export interface FieldDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: FieldPath<TFieldValues>
  label?: string
  required?: boolean
  placeholder?: string
  description?: ReactNode
}

export const FieldDatePicker = memo((props: FieldInputProps) => {
  const { name, label, required = false, placeholder, description } = props

  const { getFieldState } = useFormContext()

  const [open, setOpen] = React.useState(false)

  return (
    <FormControl
      name={name}
      label={label}
      required={required}
      description={description}
    >
      {({ value, onChange, onBlur }) => (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              aria-invalid={getFieldState(name)?.invalid}
              variant="outline"
              className={`flex items-center ${value ? "justify-between" : "justify-end"} bg-transparent font-normal hover:bg-transparent`}
            >
              {value
                ? dayjs(value)?.toDate()?.toLocaleDateString()
                : placeholder}
              <IconChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <Calendar
              className={"w-full"}
              mode="single"
              locale={ru}
              selected={value}
              defaultMonth={value}
              captionLayout="dropdown"
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  // Сбрасываем время при выборе даты, используем UTC
                  const cleanedDate = stripTimezone(selectedDate)
                  onChange(cleanedDate)
                } else {
                  onChange(null)
                }
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      )}
    </FormControl>
  )
})
