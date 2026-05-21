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
      <main style={{ width: "100%" }}>
        <AppHeader />
        {children}
      </main>
    </SidebarProvider>
  )
}
