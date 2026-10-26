"use client"

import React, { memo } from "react"
import { Protocol } from "../../model/types/protocol.schema"
import { cn } from "@workspace/ui/lib/utils"
import { ProtocolHelper } from "@/Protocols/model/helpers/protocol-helper"
import { useAuth } from "@/app/(public)/(auth)"
import { useRouter } from "next/navigation"
import { IconAlertTriangle, IconId } from "@tabler/icons-react"

export interface ProtocolCardProps {
  className?: string
  protocol: Protocol
}

export const ProtocolCard = memo((props: ProtocolCardProps) => {
  const { className, protocol } = props

  const { activeWorkspace } = useAuth()
  const router = useRouter()

  return (
    <div
      className={cn([
        `flex min-h-28 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border p-2`,
        className,
      ])}
      onClick={() => {
        if (activeWorkspace.id)
          router.push(
            `/workspaces/${activeWorkspace.id}/protocols/${protocol.id}`
          )
      }}
    >
      <div className={"mt-2 w-full text-center text-sm font-light"}>
        {ProtocolHelper.getNumberAndDate(protocol)}
      </div>
      {!protocol?.certificates || protocol?.certificates?.length === 0 ? (
        <div
          className={
            "mt-2 flex items-center justify-center gap-1 text-xs text-destructive"
          }
        >
          <IconAlertTriangle className={"size-4"} />
          <div>{"Удостоверений нет"}</div>
        </div>
      ) : (
        <div
          className={
            "mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground"
          }
        >
          <IconId className={"size-4"} />
          <div>{`${protocol.certificates.length}`}</div>
        </div>
      )}
    </div>
  )
})
