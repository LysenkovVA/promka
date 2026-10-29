import { TeamMember } from "@/TeamMember/model/types/TeamMemberSchema"

export class TeamMemberHelper {
  static getName(teamMember: TeamMember | undefined): string {
    if (!teamMember) return "Неизвестное имя"

    if (teamMember.user?.name) return teamMember.user.name

    return teamMember.user?.email
  }

  static getRole(teamMember: TeamMember | undefined): string {
    if (!teamMember) return "Неизвестная роль"

    switch (teamMember.workspaceRole) {
      case "WS_ADMINISTRATOR":
        return "Администратор"
      case "WS_MEMBER":
        return "Менеджер"
      default:
        return "Неизвестная роль"
    }
  }
}
