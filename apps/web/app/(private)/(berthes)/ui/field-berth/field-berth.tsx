"use client"

import * as React from "react"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Berth } from "../../model/types/berth.schema"
import { BerthSelector } from "@/Berthes/ui/berth-selector/berth-selector"
import { Badge } from "@workspace/ui/components/badge"
import { IconEraser } from "@tabler/icons-react"

export interface FieldBerthProps {
  label: string
  id: string
  value?: Berth
  onChange?: (value?: Berth) => void
}

export const FieldBerth = (props: FieldBerthProps) => {
  const { label, value, onChange, id } = props

  return (
    <Field>
      <FieldLabel htmlFor={id}>
        {label}
        <Badge
          variant={"secondary"}
          className="ml-auto cursor-pointer rounded-lg border-gray-500"
          onClick={() => onChange?.(undefined)}
        >
          <IconEraser className={"size-3"} style={{ color: "blue" }} />
        </Badge>
      </FieldLabel>
      <BerthSelector value={value} onChange={onChange} />
    </Field>
  )
}
