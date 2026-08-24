"use client"

import { memo } from "react"
import { useAuth } from "@/app/(public)/(auth)"
import { WorkspaceCard } from "../WorkspaceCard/WorkspaceCard"

export const WorkspacesList = memo(() => {
  const authData = useAuth()

  return (
    <div>
      {authData.user?.teamMembers?.map((teamMember) => (
        <WorkspaceCard key={teamMember?.id} workspace={teamMember?.workspace} />
      ))}
    </div>
  )
})
