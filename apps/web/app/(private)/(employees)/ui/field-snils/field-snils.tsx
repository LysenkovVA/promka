"use client"

import { memo } from "react"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  Controller,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form"
import { IconAsterisk } from "@tabler/icons-react"
import { format, InputMask, unformat } from "@react-input/mask"

export interface FieldSnilsProps<
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

// Настройки маски, вынесенные в константы для переиспользования
const SNILS_MASK_OPTIONS = {
  mask: "___-___-___ __",
  replacement: { _: /\d/ },
}

// Функция для ручного форматирования чистых цифр в маску СНИЛС
export const formatSnils = (rawSnils: string) => {
  if (rawSnils) {
    return format(rawSnils, SNILS_MASK_OPTIONS)
  } else {
    return ""
  }
}

// Очищает "123-456-789 01" -> "12345678901"
export const unmaskSnils = (value: string) =>
  unformat(value, SNILS_MASK_OPTIONS)

/**
 * Поле формы Snils
 * @param props
 * @constructor
 */
function FieldSnilsInner<TFieldValues extends FieldValues>(
  props: FieldSnilsProps<TFieldValues>
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
          <InputMask
            {...field}
            id={`${path}`}
            aria-invalid={fieldState.invalid}
            // Подменяем дефолтный элемент на компонент из shadcn
            component={Input}
            // Маска для СНИЛС: первые 9 цифр, пробел, последние 2 цифры
            {...SNILS_MASK_OPTIONS} // Разворачиваем настройки маски
            showMask={false} // Показывать маску только при вводе
            value={formatSnils(field.value) ?? ""}
            onChange={(e) => {
              // field.onChange(e)
              // onChange?.(e.target.value)
              const rawValue = unmaskSnils(e.target.value)
              field.onChange(rawValue)
              onChange?.(rawValue)
            }}
            inputMode="numeric" // Вызывает цифровую клавиатуру на мобильных устройствах
            placeholder={placeholder ?? "000-000-000 00"}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export const FieldSnils = memo(FieldSnilsInner) as <
  TFieldValues extends FieldValues,
>(
  props: FieldSnilsProps<TFieldValues>
) => ReturnType<React.FC<FieldSnilsProps<TFieldValues>>>
