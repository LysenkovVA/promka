import { useAppSelector } from "@/lib/redux"
import { getAuthData } from "@/app/(public)/(auth)/model/selectors/authSelectors"

export const useAuth = () => {
  const authData = useAppSelector(getAuthData)

  const user = authData?.user

  const activeWorkspaceId = authData?.activeWorkspaceId

  const activeTeamMember = user?.teamMembers?.find((tm) => {
    if (tm?.workspace?.id === activeWorkspaceId) {
      return tm
    }
  })

  const userWorkspaces = user?.teamMembers?.map((tm) => tm?.workspace)

  return { user, activeWorkspace: activeTeamMember?.workspace, userWorkspaces }
}
