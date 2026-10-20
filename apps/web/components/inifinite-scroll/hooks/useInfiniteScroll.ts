import { RefObject, useEffect } from "react"

export interface UseInfiniteScrollOptions {
  // callback вызывается когда пересекли элемент
  onIntersectCallback?: () => void
  triggerRef: RefObject<HTMLDivElement | null>
  wrapperRef: RefObject<HTMLDivElement | null>
}

export function useInfiniteScroll({
  onIntersectCallback,
  triggerRef,
  wrapperRef,
}: UseInfiniteScrollOptions) {
  useEffect(() => {
    const wrapperElement = wrapperRef?.current
    const triggerElement = triggerRef?.current

    let observer: IntersectionObserver | null = null

    if (onIntersectCallback) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            onIntersectCallback()
          }
        },
        {
          root: wrapperElement,
          rootMargin: "0px",
          threshold: 1.0,
        }
      )

      // за чем следим
      if (observer && triggerElement) {
        observer.observe(triggerElement)
      }
    }
    return () => {
      if (observer && triggerElement) {
        observer.unobserve(triggerElement)
      }
    }
  }, [onIntersectCallback, triggerRef, wrapperRef])
}
