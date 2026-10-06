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
import { Textarea } from "@workspace/ui/components/textarea"

export interface FieldTextAreaProps<
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
 * Поле формы TextArea
 * @param props
 * @constructor
 */
function FieldTextAreaInner<TFieldValues extends FieldValues>(
  props: FieldTextAreaProps<TFieldValues>
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
          <Textarea
            className={"min-h-[70px]"}
            {...field}
            id={`${path}`}
            aria-invalid={fieldState.invalid}
            autoComplete={"off"}
            placeholder={placeholder}
            value={field.value ?? ""}
            onChange={(e) => {
              field.onChange(e)
              onChange?.(e.target.value)
            }}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export const FieldTextArea = memo(FieldTextAreaInner) as <
  TFieldValues extends FieldValues,
>(
  props: FieldTextAreaProps<TFieldValues>
) => ReturnType<React.FC<FieldTextAreaProps<TFieldValues>>>
