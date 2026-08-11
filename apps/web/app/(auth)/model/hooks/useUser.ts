import { useAppSelector } from "@/lib/redux"
import { getAuthDataUser } from "@/app/(auth)/model/selectors/authSelectors"

export const useUser = () => {
  const user = useAppSelector(getAuthDataUser)

  return { user }
}
