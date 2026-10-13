"use client"

import { memo } from "react"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Switch } from "@workspace/ui/components/switch"
import {
  Controller,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form"
import { IconAsterisk } from "@tabler/icons-react"

export interface FieldSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  form: UseFormReturn<TFieldValues>
  path: FieldPath<TFieldValues>
  label: string
  onChange?: (value: boolean) => void
  description?: string
  required?: boolean
}

/**
 * Поле формы Switch
 * @param props
 * @constructor
 */
function FieldSwitchInner<TFieldValues extends FieldValues>(
  props: FieldSwitchProps<TFieldValues>
) {
  const { form, path, label, onChange, description, required = false } = props

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
          <Switch
            {...field}
            id={`${path}`}
            aria-invalid={fieldState.invalid}
            checked={field.value}
            onCheckedChange={(e) => {
              field.onChange(e)
              onChange?.(e)
            }}
          />
          {description && (
            <FieldDescription className={"text-sm"}>
              {description}
            </FieldDescription>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export const FieldSwitch = memo(FieldSwitchInner) as <
  TFieldValues extends FieldValues,
>(
  props: FieldSwitchProps<TFieldValues>
) => ReturnType<React.FC<FieldSwitchProps<TFieldValues>>>
