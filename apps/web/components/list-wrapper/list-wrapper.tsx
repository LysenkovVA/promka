"use client"

import { memo, ReactNode } from "react"
import { InfiniteScroll } from "@/components/inifinite-scroll"
import {
  IconDatabaseSmile,
  IconMoodEmpty,
  IconPlusFilled,
  IconSearch,
} from "@tabler/icons-react"
import { SearchBar } from "@/components/search-bar/search-bar"
import { Button } from "@workspace/ui/components/button"

export interface ListWrapperProps {
  children: ReactNode
  onScrollEnd?: () => void
  itemsCount: number
  hasMore: boolean
  title: ReactNode
  onAddClick?: () => void
  searchable?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
  isSearching?: boolean
}

/**
 * Обёртка для списков
 */
export const ListWrapper = memo((props: ListWrapperProps) => {
  const {
    children,
    onScrollEnd,
    hasMore,
    title,
    onAddClick,
    itemsCount,
    searchable = false,
    searchValue,
    onSearchChange,
    isSearching = false,
  } = props

  return (
    <div
      className={
        "flex h-full w-full flex-col items-center justify-center gap-0"
      }
    >
      {/*HEADER*/}
      <div className={"mb-2 h-16 w-full bg-muted"}>
        <div
          className={
            "mr-16 ml-16 flex h-full flex-row items-center justify-between"
          }
        >
          <div className={"text-xl"}>{title}</div>
          <div className={"flex items-center justify-center gap-2"}>
            {searchable && (
              <SearchBar
                className={"bg-white"}
                value={searchValue}
                onChange={onSearchChange}
                isSearching={isSearching}
              />
            )}
            <Button onClick={onAddClick}>
              <IconPlusFilled />
              {"Добавить"}
            </Button>
          </div>
        </div>
      </div>
      {/*END HEADER*/}
      <InfiniteScroll
        className={"h-full pr-16 pl-16"}
        onScrollEnd={onScrollEnd}
      >
        {children}
        {!hasMore &&
          itemsCount === 0 &&
          (!searchValue || searchValue?.length === 0) && (
            <div
              className={
                "mt-4 flex w-full items-center justify-center gap-2 rounded-lg border bg-muted p-2 text-center"
              }
            >
              <IconMoodEmpty className={"size-6 stroke-blue-400"} />
              <div className={"text-blue-400"}>{"Здесь пока ничего нет"}</div>
            </div>
          )}
        {!hasMore &&
          itemsCount === 0 &&
          searchValue &&
          searchValue?.length > 0 &&
          !isSearching && (
            <div
              className={
                "mt-4 flex w-full items-center justify-center gap-2 rounded-lg border bg-muted p-2 text-center"
              }
            >
              <IconSearch className={"size-6 stroke-blue-400"} />
              <div
                className={"text-blue-400"}
              >{`По запросу '${searchValue}' ничего не найдено`}</div>
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
      {/*FOOTER*/}
      <div
        className={"mt-2 flex h-16 w-full items-center justify-start bg-muted"}
      >
        <div className={"justify-start pl-16 text-center text-lg font-bold"}>
          {`Всего: ${itemsCount}`}
        </div>
      </div>
      {/*END FOOTER*/}
    </div>
  )
})
