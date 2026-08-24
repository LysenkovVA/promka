"use client"

import { memo } from "react"
import { Workspace } from "../../model/types/WorkspaceSchema"
import Link from "next/link"

export interface WorkspaceCardProps {
  workspace: Workspace
}

export const WorkspaceCard = memo((props: WorkspaceCardProps) => {
  const { workspace } = props

  return (
    <Link href={`/workspaces/${workspace.id}`}>
      <div className={"cursor-pointer rounded-xl border border-black p-2"}>
        <div>{workspace?.company.name}</div>
      </div>
    </Link>
  )
})
