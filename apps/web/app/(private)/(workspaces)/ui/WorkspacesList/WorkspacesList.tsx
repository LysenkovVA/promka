"use client"

import { memo } from "react"
import { useAuth } from "@/app/(public)/(auth)"
import { WorkspaceCard } from "../WorkspaceCard/WorkspaceCard"

export const WorkspacesList = memo(() => {
  const authData = useAuth()

  return (
    <>
      <div style={{ fontSize: 20, marginBottom: 16 }}>{`Мои организации`}</div>
      <div className={"flex flex-col items-center justify-center gap-3"}>
        {authData.user?.teamMembers?.map((teamMember) => (
          <WorkspaceCard
            key={teamMember?.id}
            workspace={teamMember?.workspace}
          />
        ))}
      </div>
    </>
  )
})
