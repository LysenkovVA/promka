import { useAppSelector } from "@/lib/redux"
import { getAuthData } from "@/app/(public)/(auth)/model/selectors/authSelectors"
import { TeamMember } from "@/TeamMember/model/types/TeamMemberSchema"
import { Workspace } from "@/Workspaces/model/types/WorkspaceSchema"

export const useAuth = () => {
  const authData = useAppSelector(getAuthData)

  const user = authData?.user

  const activeWorkspaceId = authData?.activeWorkspaceId

  const activeWorkspace: Workspace = user?.teamMembers?.find(
    (tm: TeamMember) => {
      if (tm.workspace?.id === activeWorkspaceId) return tm.workspace
    }
  )

  const userWorkspaces: Workspace[] | undefined = user?.teamMembers?.map(
    (tm) => tm.workspace
  )

  return { user, activeWorkspace, userWorkspaces }
}
