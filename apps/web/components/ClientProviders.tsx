"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { StoreProvider } from "@/lib/redux"
import { AuthProvider } from "@/app/(public)/(auth)/ui/AuthProvider"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { Toaster } from "@workspace/ui/components/sonner"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <ThemeProvider>
        <StoreProvider>
          <AuthProvider>{children}</AuthProvider>
        </StoreProvider>
      </ThemeProvider>
      <Toaster />
    </TooltipProvider>
  )
}
