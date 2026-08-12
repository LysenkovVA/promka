"use client"

import { memo } from "react"
import { BreadcrumbSeparator } from "@workspace/ui/components/breadcrumb"
import { IconPoint } from "@tabler/icons-react"

export const HeaderMenuSeparator = memo((_) => {
  return (
    <BreadcrumbSeparator>
      <IconPoint stroke={2} />
    </BreadcrumbSeparator>
  )
})
