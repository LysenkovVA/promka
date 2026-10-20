"use client"

import React, { memo, ReactNode, useEffect, useRef } from "react"
import { useInfiniteScroll } from "../hooks/useInfiniteScroll"
import { useThrottle } from "../hooks/useThrottle"
import { InfiniteScrollActions } from "../model/slices/InfiniteScrollSlice"
import { usePathname } from "next/navigation"
import { getInfiniteScrollByPath } from "../model/selectors/infiniteScrollSelectors"
import { GlobalStateSchema, useAppDispatch, useAppSelector } from "@/lib/redux"
import { cn } from "@workspace/ui/lib/utils"

const INTERSECTION_HEIGHT = 20
const INTERSECTION_MARGIN = 10

export interface InfinitePageProps {
  className?: string
  children: ReactNode
  // height: number | string
  onScrollEnd?: () => void
  storeScrollPosition?: boolean
}

export const InfiniteScroll = memo((props: InfinitePageProps) => {
  const {
    className,
    children,
    onScrollEnd,
    // height,
    storeScrollPosition = true,
  } = props
  const pathname = usePathname()

  const dispatch = useAppDispatch()
  const scrollPosition = useAppSelector((state: GlobalStateSchema) =>
    getInfiniteScrollByPath(state, pathname)
  )

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (storeScrollPosition) {
      if (wrapperRef.current) {
        wrapperRef.current.scrollTop = scrollPosition
      }
    }
  }, [])

  useInfiniteScroll({
    wrapperRef: wrapperRef,
    triggerRef,
    onIntersectCallback: onScrollEnd,
  })

  // Позиция скролла сохраняется в Redux с временным интервалом
  const onScroll = useThrottle((e: React.UIEvent<HTMLDivElement>) => {
    if (storeScrollPosition) {
      dispatch(
        InfiniteScrollActions.setScrollPosition({
          position: e.currentTarget.scrollTop,
          path: pathname,
        })
      )
    }
  }, 500)

  return (
    <div
      ref={wrapperRef}
      className={cn(["w-full overflow-y-auto", className])}
      // style={{
      //   width: "100%",
      //   height: height,
      //   overflowY: "auto",
      //   ...style,
      // }}
      onScroll={onScroll}
    >
      {children}
      {/*В конце страницы в случае отслеживания события onScrollEnd помещаем элемент,
            по которому будет определяться пересечение и срабатывать событие onScrollEnd из хука useInfiniteScroll*/}
      {onScrollEnd ? (
        <div
          style={{
            height: INTERSECTION_HEIGHT,
            margin: INTERSECTION_MARGIN,
          }}
          ref={triggerRef}
        />
      ) : null}
    </div>
  )
})
