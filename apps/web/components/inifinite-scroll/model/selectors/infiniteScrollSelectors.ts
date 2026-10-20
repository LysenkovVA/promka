import { createSelector } from "@reduxjs/toolkit"
import { GlobalStateSchema } from "@/lib/redux"

export const getInfiniteScroll = (state: GlobalStateSchema) =>
  state.infiniteScrollSchema?.scroll
export const getInfiniteScrollByPath = createSelector(
  getInfiniteScroll,
  (state: GlobalStateSchema, path: string) => path,
  (scroll, path) => scroll?.[path] || 0
)
