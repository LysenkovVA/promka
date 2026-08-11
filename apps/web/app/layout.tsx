import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { StoreProvider } from "@/lib/redux"
import { AuthProvider } from "@/app/(auth)/ui/AuthProvider"
import { Toaster } from "@workspace/ui/components/sonner"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        {/*<ClientProviders>{children}</ClientProviders>*/}
        <TooltipProvider>
          <ThemeProvider>
            <StoreProvider>
              <AuthProvider>{children}</AuthProvider>
            </StoreProvider>
          </ThemeProvider>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  )
}
