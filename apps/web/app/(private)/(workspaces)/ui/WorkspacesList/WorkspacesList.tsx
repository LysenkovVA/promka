"use client"

import { memo } from "react"
import { useAuth } from "@/app/(public)/(auth)"
import { WorkspaceCard } from "../WorkspaceCard/WorkspaceCard"
import { PageWrapper } from "@/components/page-wrapper/page-wrapper"

export const WorkspacesList = memo(() => {
  const authData = useAuth()

  return (
    <PageWrapper>
      <div style={{ fontSize: 20, marginBottom: 16 }}>{`Мои организации`}</div>
      <div
        className={
          "grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2"
        }
      >
        {authData.user?.teamMembers?.map((teamMember) => (
          <WorkspaceCard
            key={teamMember?.id}
            workspace={teamMember?.workspace}
          />
        ))}
      </div>
    </PageWrapper>
  )
})
