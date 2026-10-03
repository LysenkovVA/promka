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
          "flex w-full items-center justify-start gap-3 rounded-lg border bg-muted p-2"
        }
      >
        <Picture
          src={"/logo.png"}
          alt={"pic"}
          // size={"xs"}
          style={{ width: 100, height: 70, border: "1px solid gray" }}
        />
        <div className={"line-clamp-2 min-w-0 flex-1 text-sm"}>
          <span className="block whitespace-nowrap">
            {workspace?.company.name}
          </span>
        </div>
      </div>
    </Link>
  )
})
