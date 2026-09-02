"use client"

import Image from "next/image"
import { FileX } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

type PictureSize = "xs" | "sm" | "md" | "lg" | "xl"

const sizeMap: Record<PictureSize, string> = {
  xs: "size-12",
  sm: "size-16",
  md: "size-24",
  lg: "size-32",
  xl: "size-48",
}

interface PictureProps extends Omit<React.ComponentProps<typeof Image>, "src"> {
  src?: string
  size?: PictureSize
  alt: string
  className?: string
}

function Picture({
  src,
  size = "md",
  alt,
  className,
  style,
  ...props
}: PictureProps) {
  const sizeClass = sizeMap[size]

  if (!src) {
    return (
      <div
        data-slot="picture"
        data-size={size}
        className={cn(
          "group/picture relative flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted",
          sizeClass,
          className
        )}
      >
        <FileX className="size-6 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div
      data-slot="picture-wrapper"
      data-size={size}
      className={cn(
        "group/picture relative aspect-square shrink-0 overflow-hidden rounded-lg border border-border",
        sizeClass,
        className
      )}
      style={style}
    >
      <Image
        data-slot="picture"
        data-size={size}
        src={src}
        alt={alt}
        fill
        className="object-cover"
        {...props}
      />
    </div>
  )
}

export { Picture }
