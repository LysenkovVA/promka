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
import { BerthType } from "../../model/types/berth-type.schema"
import { BerthTypeSelector } from "../berth-type-selector/berth-type-selector"

export interface FieldBerthTypeProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  form: UseFormReturn<TFieldValues>
  path: FieldPath<TFieldValues>
  label: string
  onChange?: (value: BerthType | null) => void
  description?: string
  required?: boolean
}

/**
 * Поле формы BerthType
 * @param props
 * @constructor
 */
function FieldBerthTypeInner<TFieldValues extends FieldValues>(
  props: FieldBerthTypeProps<TFieldValues>
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
          <BerthTypeSelector
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

export const FieldBerthType = memo(FieldBerthTypeInner) as <
  TFieldValues extends FieldValues,
>(
  props: FieldBerthTypeProps<TFieldValues>
) => ReturnType<React.FC<FieldBerthTypeProps<TFieldValues>>>
