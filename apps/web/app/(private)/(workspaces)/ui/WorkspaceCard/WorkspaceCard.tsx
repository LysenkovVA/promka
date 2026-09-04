"use client"

import { memo } from "react"
import { Workspace } from "../../model/types/workspace.schema"
import Link from "next/link"
import { Picture } from "@/components/picture"

export interface WorkspaceCardProps {
  workspace: Workspace
}

export const WorkspaceCard = memo((props: WorkspaceCardProps) => {
  const { workspace } = props

  return (
    <Link className={"w-full"} href={`/workspaces/${workspace.id}`}>
      <div
        className={
          "flex w-full items-start justify-start gap-3 rounded-lg border bg-muted p-2"
        }
      >
        <Picture
          src={"/logo.png"}
          alt={"pic"}
          // size={"xs"}
          style={{ width: 150, height: 100, border: "1px solid gray" }}
        />
        <div
          className={"flex w-full flex-col items-start justify-center gap-2"}
        >
          <div style={{ fontSize: 20 }}>{`${workspace?.company.name}`}</div>
        </div>
      </div>
    </Link>
  )
})
