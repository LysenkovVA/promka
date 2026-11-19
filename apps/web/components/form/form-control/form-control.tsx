import { Controller, get, useFormContext } from "react-hook-form"
import { FormFieldError } from "@/components/form/form-field-error/form-field-error"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/field"
import { ReactNode } from "react"

interface FormControlProps {
  name: string // Полный путь, например: "groups.0.students.1.role"
  label?: string
  required?: boolean
  description?: ReactNode
  rules?: Record<string, any>
  children: (fieldProps: {
    value: any
    onChange: (...event: any[]) => void
    onBlur: () => void
    error?: { message?: string }
  }) => React.ReactNode
}

/**
 * Универсальная обертка поля формы для кастомного контрола
 * @description ‼️Форма должна быть обёрнута в FormProvider
 *
 * @param name Путь в объекте
 * @param rules Правила
 * @param children
 * @param label Название поля
 * @param required Обязательное поле (значок *)
 * @param description Описание под полем
 * @constructor
 */
export function FormControl({
  name,
  rules,
  children,
  label,
  required,
  description,
}: FormControlProps) {
  const { control, formState, getFieldState } = useFormContext()

  // Достаем ошибку конкретно для этого контрола
  const error = get(formState.errors, name)

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange, onBlur } }) => (
        <Field className={"w-full"}>
          <FieldLabel
            className={`${getFieldState(name)?.invalid ? "text-destructive" : undefined}`}
            htmlFor={`${name}`}
          >
            <div className={"flex w-full items-center justify-start gap-1"}>
              {label}
              {required && label && (
                // <IconAsterisk className={"size-2 text-destructive"} />
                <div
                  className={
                    "rounded-lg border border-destructive bg-muted p-0.5 text-xs font-light text-destructive"
                  }
                >
                  {"обязательно"}
                </div>
              )}
            </div>
          </FieldLabel>
          {children({ value, onChange, onBlur, error })}
          {description && (
            <FieldDescription className={"pr-1.5 pl-1.5 font-light"}>
              {description}
            </FieldDescription>
          )}
          {/* В случае если в FormControl завернут Selector, то из него прилетает не просто поле, а объект.*/}
          {/* В таком случае само поле становится невалидным, а ошибка показывается для внутреннего поля. */}
          {/* Для списков дополнительно проверяется поле id */}
          {error && (
            <FormFieldError
              message={
                error?.message || error?.id?.message
                  ? error?.message || error?.id?.message
                  : `Ошибка валидации внутри объекта '${name}'`
              }
            />
          )}
          {/*{error && (error.message || typeof error === "object") && (*/}
          {/*  <FormFieldError*/}
          {/*    message={*/}
          {/*      error.message ?? `Ошибка валидации внутри объекта '${name}'`*/}
          {/*    }*/}
          {/*  />*/}
          {/*)}*/}
        </Field>
      )}
    />
  )
}
