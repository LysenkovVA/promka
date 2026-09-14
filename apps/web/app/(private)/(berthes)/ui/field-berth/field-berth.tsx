"use client"

import * as React from "react"
import { useState } from "react"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Berth } from "../../model/types/berth.schema"
import { BerthSelector } from "@/Berthes/ui/berth-selector/berth-selector"

export interface FieldBerthProps {
  label: string
  id: string
  value?: Berth
  onChange?: (value?: Berth) => void
}

export const FieldBerth = (props: FieldBerthProps) => {
  const { label, value, onChange, id } = props

  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false)
  const [editBerthId, setEditBerthId] = useState<string | undefined>(undefined)

  return (
    <>
      <Field>
        <FieldLabel htmlFor={id}>
          <div className={"flex w-full items-center justify-between"}>
            {label}
            {/*{value?.id && (*/}
            {/*  <div className={"flex items-center justify-center gap-1"}>*/}
            {/*    <Badge*/}
            {/*      variant={"secondary"}*/}
            {/*      className={`${value ? "cursor-pointer" : "cursor-default"} rounded-lg border-gray-500`}*/}
            {/*      onClick={() => onChange?.(undefined)}*/}
            {/*    >*/}
            {/*      <IconEraser className={"size-3"} style={{ color: "blue" }} />*/}
            {/*      <div className={"text-xs font-light text-muted-foreground"}>*/}
            {/*        {"очистить"}*/}
            {/*      </div>*/}
            {/*    </Badge>*/}
            {/*    <Badge*/}
            {/*      variant={"secondary"}*/}
            {/*      className={`${value.id ? "cursor-pointer" : "cursor-default"} rounded-lg border-gray-500`}*/}
            {/*      onClick={() => {*/}
            {/*        setEditBerthId(value.id!)*/}
            {/*        setIsOpenEditDialog(true)*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      <div className={"flex items-center justify-center gap-1"}>*/}
            {/*        <IconEditFilled*/}
            {/*          className={"size-3"}*/}
            {/*          style={{ color: "orange" }}*/}
            {/*        />*/}
            {/*        <div className={"text-xs font-light text-muted-foreground"}>*/}
            {/*          {"правка"}*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*    </Badge>*/}
            {/*  </div>*/}
            {/*)}*/}
          </div>
        </FieldLabel>
        <div className={"w-full"}>
          <BerthSelector
            // className={"w-full"}
            value={value}
            onChange={onChange}
          />
        </div>
      </Field>
      {/*{isOpenEditDialog && (*/}
      {/*  <BerthEditDialog*/}
      {/*    isOpen={isOpenEditDialog}*/}
      {/*    onOpenChange={(isOpen) => setIsOpenEditDialog(isOpen)}*/}
      {/*    berthId={editBerthId}*/}
      {/*    onSubmit={(submittedBerth) => {*/}
      {/*      onChange?.({ ...submittedBerth })*/}
      {/*      setIsOpenEditDialog(false)*/}
      {/*      setEditBerthId(undefined)*/}
      {/*    }}*/}
      {/*    onClose={() => {*/}
      {/*      setIsOpenEditDialog(false)*/}
      {/*      setEditBerthId(undefined)*/}
      {/*    }}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  )
}
