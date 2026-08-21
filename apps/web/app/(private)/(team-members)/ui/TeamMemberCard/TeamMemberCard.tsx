"use client"

import { memo } from "react"
import { TeamMember } from "../../model/types/TeamMemberSchema"

export interface TeamMemberCardProps {
  teamMember: TeamMember
}

export const TeamMemberCard = memo((props: TeamMemberCardProps) => {
  const { teamMember } = props

  return (
    <div className={"rounded-xl border border-black p-2"}>
      <div>{teamMember.workspace?.company.name}</div>
      <div>{teamMember.teamMemberRole}</div>
    </div>
  )
})
