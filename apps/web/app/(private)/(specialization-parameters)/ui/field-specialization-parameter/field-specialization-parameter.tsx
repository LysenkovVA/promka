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
import { SpecializationParameter } from "../../model/types/specialization-parameter.schema"
import { SpecializationParameterSelector } from "../specialization-parameter-selector/specialization-parameter-selector"

export interface FieldSpecializationParameterProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  form: UseFormReturn<TFieldValues>
  path: FieldPath<TFieldValues>
  label: string
  onChange?: (value: SpecializationParameter | null) => void
  description?: string
  required?: boolean
}

/**
 * Поле формы SpecializationParameter
 * @param props
 * @constructor
 */
function FieldSpecializationParameterInner<TFieldValues extends FieldValues>(
  props: FieldSpecializationParameterProps<TFieldValues>
) {
  const { form, path, label, onChange, description, required = false } = props

  return (
    <Controller
      control={form.control}
      name={path}
      render={({ field, fieldState }) => (
        <Field aria-invalid={fieldState.invalid} className={"w-full"}>
          <FieldLabel>
            <div className={"flex w-full items-center justify-start gap-1"}>
              {label}
              {required && (
                <IconAsterisk className={"size-2 text-destructive"} />
              )}
            </div>
          </FieldLabel>
          <SpecializationParameterSelector
            value={field.value ?? null}
            onChange={(e) => {
              field.onChange(e)
              onChange?.(e)
            }}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export const FieldSpecializationParameter = memo(
  FieldSpecializationParameterInner
) as <TFieldValues extends FieldValues>(
  props: FieldSpecializationParameterProps<TFieldValues>
) => ReturnType<React.FC<FieldSpecializationParameterProps<TFieldValues>>>
