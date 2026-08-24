"use client"

import { Dashboard } from "@/app/(private)/(dashboard)/ui/Dashboard/Dashboard"

const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    online: navigator.onLine,
    hardwareConcurrency: navigator.hardwareConcurrency, // кол-во ядер
    deviceMemory: (navigator as any).deviceMemory, // доступная память (в ГБ), не везде поддерживается
  }
}

const isMobileDevice = (): boolean => {
  const userAgent = navigator.userAgent
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  )
}

const getScreenInfo = () => {
  return {
    width: screen.width,
    height: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth,
  }
}

const isTouchDevice = (): boolean => {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0
}

const isSmallScreen = (): boolean => {
  return window.matchMedia("(max-width: 768px)").matches
}

export default function DashboardCompaniesPage() {
  return <Dashboard />
}
