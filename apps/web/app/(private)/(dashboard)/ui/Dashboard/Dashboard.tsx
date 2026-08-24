"use client"

import { memo, useEffect } from "react"
import { WorkspacesList } from "@/Workspaces"
import { useAppDispatch } from "@/lib/redux"
import { authActions } from "@/app/(public)/(auth)"

export const Dashboard = memo(() => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(authActions.setActiveWorkspaceId(undefined))
  }, [])

  return <WorkspacesList />
})
