"use client"

import React, { memo } from "react"
import { TeamMemberCard } from "@/TeamMember/ui/team-member-card/team-member-card"
import { TeamMember } from "@/TeamMember/model/types/TeamMemberSchema"
import { Button } from "@workspace/ui/components/button"

export interface TeamMembersListProps {
  teamMembers?: TeamMember[]
}

export const TeamMembersList = memo((props: TeamMembersListProps) => {
  const { teamMembers } = props

  return (
    <div className={"w-full rounded-lg border p-2"}>
      <div className={"mb-4 flex items-center justify-between"}>
        <div className={"text-lg text-muted-foreground"}>{"Команда"}</div>
        <Button disabled variant={"outline"}>
          {"Пригласить"}
        </Button>
      </div>
      {(!teamMembers || teamMembers.length === 0) && (
        <div className={"text-sm text-destructive"}>
          {"Команда отсутствует"}
        </div>
      )}
      {teamMembers?.map((teamMember) => (
        <TeamMemberCard key={teamMember.id} teamMember={teamMember} />
      ))}
    </div>
  )
})
