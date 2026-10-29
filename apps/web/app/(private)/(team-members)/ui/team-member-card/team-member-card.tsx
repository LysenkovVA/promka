"use client"

import { memo } from "react"
import { TeamMember } from "@/TeamMember/model/types/TeamMemberSchema"
import { Avatar } from "@workspace/ui/components/avatar"
import { TeamMemberHelper } from "@/TeamMember/helpers/team-member-helper"
import { Button } from "@workspace/ui/components/button"
import { IconSettings } from "@tabler/icons-react"

export interface TeamMemberCardProps {
  teamMember: TeamMember
}

export const TeamMemberCard = memo((props: TeamMemberCardProps) => {
  const { teamMember } = props

  return (
    <div
      className={
        "flex w-fit flex-col items-center justify-center gap-2 rounded-lg border p-2"
      }
    >
      <div className={"flex items-center justify-center gap-2"}>
        <Avatar size={"lg"} />
        <div className={"flex flex-col items-start justify-center gap-0"}>
          <div className={"text-sm"}>
            {TeamMemberHelper.getName(teamMember)}
          </div>
          <div className={"text-xs text-muted-foreground"}>
            {TeamMemberHelper.getRole(teamMember)}
          </div>
        </div>
      </div>
      <Button variant={"secondary"} size={"xs"} disabled>
        <IconSettings />
        {"Права доступа"}
      </Button>
    </div>
  )
})
