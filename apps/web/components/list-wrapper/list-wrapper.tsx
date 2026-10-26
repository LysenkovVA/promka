"use client"

import { memo, ReactNode } from "react"
import { InfiniteScroll } from "@/components/inifinite-scroll"
import { IconDatabaseSmile, IconMoodEmpty } from "@tabler/icons-react"

export interface ListWrapperProps {
  children: ReactNode
  onScrollEnd?: () => void
  itemsCount: number
  hasMore: boolean
  header?: ReactNode
  footer?: ReactNode
}

/**
 * Обёртка для списков
 */
export const ListWrapper = memo((props: ListWrapperProps) => {
  const { children, onScrollEnd, hasMore, header, footer, itemsCount } = props

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
        {!hasMore && itemsCount === 0 && (
          <div
            className={
              "mt-4 flex w-full items-center justify-center gap-2 rounded-lg border bg-muted p-2 text-center"
            }
          >
            <IconMoodEmpty className={"stroke-blue-400"} />
            <div className={"text-blue-400"}>{"Здесь пока ничего нет"}</div>
          </div>
        )}
        {!hasMore && itemsCount > 0 && (
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
