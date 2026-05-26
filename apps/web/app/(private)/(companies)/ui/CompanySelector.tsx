"use client"

import { memo } from "react"
import { ICompanyEntity } from "@/app/(private)/(companies)/model/types/ICompanyEntity"
import Image from "next/image"
import { HEADER_HEIGHT } from "@/config/app"

export interface CompanySelectorProps {
  companies: Array<ICompanyEntity> | undefined
}

export const CompanySelector = memo((props: CompanySelectorProps) => {
  const { companies } = props

  return (
    <div
      className={
        "br justify-middle mb-4 flex flex-col items-start rounded-lg border bg-gray-400 p-2"
      }
    >
      <Image
        src="/logo.png" // Убедитесь, что файл находится в public/logo.png
        alt="Логотип"
        loading={"eager"}
        width={HEADER_HEIGHT * 0.9}
        height={HEADER_HEIGHT * 0.9}
        style={{ objectFit: "contain" }}
      />
      <h4 className="scroll-m-20 text-xs font-light tracking-tight">Промка+</h4>
    </div>
  )
})
