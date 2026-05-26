"use client"

import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant={"inset"} />
      <SidebarInset>
        <AppHeader />
        <main
          style={{
            height: "calc(100vh - var(--header-height) - 16px)", // Занимает всю высоту экрана минус шапка и отступы
            display: "flex",
          }}
        >
          <div
            style={{
              width: "100%",
              overflowY: "auto",
              flexGrow: 1,
              padding: 16,
              margin: 8,
            }}
          >
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
