"use client"

import { SidebarProvider } from "@workspace/ui/components/sidebar"
import { AppSidebar } from "@/components/AppSidebar/app-sidebar"
import { AppHeader } from "@/components/AppHeader/AppHeader"

/**
 * Layout для приватных страниц
 * @param children
 * @constructor
 */
export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // console.log("🌞PrivateLayout отрисован")

  return (
    <SidebarProvider>
      <AppSidebar />
      <div
        style={{
          // display: "flex",
          // flexDirection: "column",
          // alignItems: "center",
          // justifyContent: "center",
          // margin: "auto",
          width: "100%",
        }}
      >
        <AppHeader />
        <main
          style={{
            width: "100%",
            padding: 8,
            margin: 8,
            borderRadius: 12,
            border: "1px solid black",
            // height: "100%",
          }}
        >
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
