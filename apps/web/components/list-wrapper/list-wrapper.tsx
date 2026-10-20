"use client"

import { memo, ReactNode } from "react"
import { InfiniteScroll } from "@/components/inifinite-scroll"
import { IconDatabaseSmile } from "@tabler/icons-react"

export interface ListWrapperProps {
  children: ReactNode
  onScrollEnd?: () => void
  hasMore: boolean
  header?: ReactNode
  footer?: ReactNode
}

/**
 * Обёртка для списков
 */
export const ListWrapper = memo((props: ListWrapperProps) => {
  const { children, onScrollEnd, hasMore, header, footer } = props

  return (
    <div
      className={
        "flex h-full w-full flex-col items-center justify-center gap-0"
      }
    >
      {header}
      <InfiniteScroll
        className={"h-full pr-16 pl-16"}
        onScrollEnd={onScrollEnd}
      >
        {children}
        {!hasMore && (
          <div
            className={
              "mt-4 flex w-full items-center justify-center gap-2 rounded-lg border bg-muted p-2 text-center"
            }
          >
            <IconDatabaseSmile className={"stroke-amber-500"} />
            <div className={"text-amber-500"}>{"Все данные загружены!"}</div>
          </div>
        )}
      </InfiniteScroll>
      {footer}
    </div>
  )
})
