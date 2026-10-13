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
import { CertificateType } from "../../model/types/certificate-type.schema"
import { CertificateTypeSelector } from "../certificate-type-selector/certificate-type-selector"

export interface FieldCertificateTypeProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  form: UseFormReturn<TFieldValues>
  path: FieldPath<TFieldValues>
  label: string
  onChange?: (value: CertificateType | null) => void
  description?: string
  required?: boolean
}

/**
 * Поле формы CertificateType
 * @param props
 * @constructor
 */
function FieldCertificateTypeInner<TFieldValues extends FieldValues>(
  props: FieldCertificateTypeProps<TFieldValues>
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
          <CertificateTypeSelector
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

export const FieldCertificateType = memo(FieldCertificateTypeInner) as <
  TFieldValues extends FieldValues,
>(
  props: FieldCertificateTypeProps<TFieldValues>
) => ReturnType<React.FC<FieldCertificateTypeProps<TFieldValues>>>
