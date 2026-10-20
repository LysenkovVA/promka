"use client"

import { memo } from "react"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  Controller,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form"
import { IconAsterisk } from "@tabler/icons-react"
import "react-phone-number-input/style.css"
import { Input } from "@workspace/ui/components/input"
import PhoneInput, {
  parsePhoneNumber,
  Value,
} from "react-phone-number-input/input"

export interface FieldPhoneProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  form: UseFormReturn<TFieldValues>
  path: FieldPath<TFieldValues>
  label: string
  placeholder?: string
  onChange?: (value: string) => void
  description?: string
  required?: boolean
}

/**
 * Поле формы Phone
 * @param props
 * @constructor
 */
function FieldPhoneInner<TFieldValues extends FieldValues>(
  props: FieldPhoneProps<TFieldValues>
) {
  const {
    form,
    path,
    label,
    placeholder,
    onChange,
    description,
    required = false,
  } = props

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
          <PhoneInput
            {...field}
            id={`${path}`}
            aria-invalid={fieldState.invalid}
            // Подменяем дефолтный элемент на компонент из shadcn
            inputComponent={Input}
            value={
              (field.value
                ? parsePhoneNumber(field.value)?.number
                : undefined) as Value
            }
            onChange={(e) => {
              field.onChange(e ?? "")
              onChange?.(e ?? "")
            }}
            inputMode="numeric" // Вызывает цифровую клавиатуру на мобильных устройствах
            placeholder={placeholder ?? "Введите номер телефона"}
            // country={parsePhoneNumber(field.value)?.country}
            // // Разрешаем вводить международный плюс
            // international={true}
            // withCountryCallingCode={true}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export const FieldPhone = memo(FieldPhoneInner) as <
  TFieldValues extends FieldValues,
>(
  props: FieldPhoneProps<TFieldValues>
) => ReturnType<React.FC<FieldPhoneProps<TFieldValues>>>
