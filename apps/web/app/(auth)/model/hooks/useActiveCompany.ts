import { useAppSelector } from "@/lib/redux"
import { getAuthData } from "@/app/(auth)/model/selectors/authSelectors"

export const useActiveCompany = () => {
  const authData = useAppSelector(getAuthData)

  return authData?.activeCompany
}
