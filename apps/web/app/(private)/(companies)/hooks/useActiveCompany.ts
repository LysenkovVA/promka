import { useUser } from "@/app/(auth)"
import { useEffect, useState } from "react"

export const useActiveCompany = () => {
  const { user } = useUser()

  const [activeCompanyId, setActiveCompanyId] = useState<string | undefined>(
    undefined
  )

  useEffect(() => {
    const item = localStorage.getItem("activeCompanyId")

    if (item) {
      setActiveCompanyId(item)
    }
  }, [])

  if (!activeCompanyId) {
    return undefined
  } else {
    return user?.companies?.find((company) => company.id === activeCompanyId)
  }
}
