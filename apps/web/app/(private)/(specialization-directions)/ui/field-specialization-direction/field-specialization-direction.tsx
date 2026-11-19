"use client"

import { memo } from "react"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form"
import { IconAsterisk } from "@tabler/icons-react"
import { SpecializationDirection } from "../../model/types/specialization-direction.schema"
import { SpecializationDirectionSelector } from "../specialization-direction-selector/specialization-direction-selector"

export interface FieldSpecializationDirectionProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  control: Control<TFieldValues, any, TFieldValues>
  path: FieldPath<TFieldValues>
  label: string
  onChange?: (value: SpecializationDirection | null) => void
  description?: string
  required?: boolean
}

/**
 * Поле формы SpecializationDirection
 * @param props
 * @constructor
 */
function FieldSpecializationDirectionInner<TFieldValues extends FieldValues>(
  props: FieldSpecializationDirectionProps<TFieldValues>
) {
  const {
    control,
    path,
    label,
    onChange,
    description,
    required = false,
  } = props

  return (
    <Controller
      control={control}
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
          <SpecializationDirectionSelector
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

export const FieldSpecializationDirection = memo(
  FieldSpecializationDirectionInner
) as <TFieldValues extends FieldValues>(
  props: FieldSpecializationDirectionProps<TFieldValues>
) => ReturnType<React.FC<FieldSpecializationDirectionProps<TFieldValues>>>
