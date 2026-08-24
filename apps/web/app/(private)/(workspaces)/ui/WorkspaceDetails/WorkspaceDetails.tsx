"use client"

import { memo, useEffect } from "react"
import { useAppDispatch } from "@/lib/redux"
import { authActions } from "@/app/(public)/(auth)"

export interface WorkspaceDetailsProps {
  workspaceId: string
}

export const WorkspaceDetails = memo((props: WorkspaceDetailsProps) => {
  const { workspaceId } = props

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (workspaceId) {
      dispatch(authActions.setActiveWorkspaceId(workspaceId))
    }
  }, [])

  return (
    <div>{`Это страница с инофрмацией по workspace (id=${workspaceId})`}</div>
  )
})
