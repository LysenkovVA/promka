"use client"

import * as React from "react"
import { memo } from "react"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import { Button } from "@workspace/ui/components/button"
import { stripTimezone } from "@/lib/date/utils"
import {
  Controller,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form"
import { IconAsterisk, IconChevronDown } from "@tabler/icons-react"
import dayjs from "dayjs"

export interface FieldDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  form: UseFormReturn<TFieldValues>
  path: FieldPath<TFieldValues>
  label: string
  placeholder?: string
  onChange?: (value: Date | null) => void
  description?: string
  required?: boolean
}

function FieldDatePickerInner<TFieldValues extends FieldValues>(
  props: FieldDatePickerProps<TFieldValues>
) {
  const {
    form,
    path,
    label,
    placeholder = "Выберите дату",
    onChange,
    description,
    required = false,
  } = props

  const [open, setOpen] = React.useState(false)

  return (
    <Controller
      control={form.control}
      name={path}
      render={({ field, fieldState }) => (
        <Field aria-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`${path}`}>
            <div className={"flex w-full items-center justify-start gap-1"}>
              {label}
              {required && (
                <IconAsterisk className={"size-2 text-destructive"} />
              )}
            </div>
          </FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild {...field} id={`${path}`}>
              <Button variant="outline" className="justify-between font-normal">
                {field.value
                  ? dayjs(field.value)?.toDate()?.toLocaleDateString()
                  : placeholder}
                <IconChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <Calendar
                className={"w-full"}
                mode="single"
                selected={field.value}
                defaultMonth={field.value}
                captionLayout="dropdown"
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    // Сбрасываем время при выборе даты, используем UTC
                    const cleanedDate = stripTimezone(selectedDate)
                    field.onChange(cleanedDate)
                    onChange?.(cleanedDate ?? null)
                  } else {
                    field.onChange(null)
                    onChange?.(null)
                  }
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export const FieldDatePicker = memo(FieldDatePickerInner) as <
  TFieldValues extends FieldValues,
>(
  props: FieldDatePickerProps<TFieldValues>
) => ReturnType<React.FC<FieldDatePickerProps<TFieldValues>>>
