"use client"

import React, { memo } from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { IconFidgetSpinner, IconSearch } from "@tabler/icons-react"

export interface SearchBarProps {
  className?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  isSearching?: boolean
}

export const SearchBar = memo((props: SearchBarProps) => {
  const {
    className,
    value,
    onChange,
    placeholder = "Найти...",
    isSearching,
  } = props

  return (
    <InputGroup className={className}>
      <InputGroupInput
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value)
        }}
      />
      <InputGroupAddon align="inline-start">
        {isSearching ? (
          <IconFidgetSpinner className={"animate-spin"} />
        ) : (
          <IconSearch className="text-muted-foreground" />
        )}
      </InputGroupAddon>
    </InputGroup>
  )
})
