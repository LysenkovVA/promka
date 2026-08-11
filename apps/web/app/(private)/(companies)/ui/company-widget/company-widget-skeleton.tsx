"use client"

import { memo } from "react"
import { Item, ItemActions, ItemContent } from "@workspace/ui/components/item"
import { Skeleton } from "@workspace/ui/components/skeleton"

export interface CompanyWidgetSkeletonProps {}

export const CompanyWidgetSkeleton = memo(
  (props: CompanyWidgetSkeletonProps) => {
    return (
      <Item className={"w-full"} variant={"outline"}>
        <ItemContent>
          <Skeleton className="align-center flex h-4 w-2/3 justify-center" />
          <div className={"flex w-full items-center justify-start gap-2"}>
            <Skeleton className="align-center flex h-4 w-2/3 justify-center" />
            <Skeleton className="align-center flex h-4 w-2/3 justify-center" />
          </div>
        </ItemContent>
        <ItemActions className={"h-full"}>
          <Skeleton className="h-4 w-10" />
        </ItemActions>
      </Item>
    )
  }
)
