"use client"

import { useCallback, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux"
import { getAuthDataUser } from "@/app/(auth)/model/selectors/authSelectors"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import { testAuthThunk } from "@/app/(auth)/model/thunks/testAuthThunk"

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

export default function Page() {
  const [deviceInfo, setDeviceInfo] = useState<ReturnType<
    typeof getDeviceInfo
  > | null>(null)

  useEffect(() => {
    setDeviceInfo(getDeviceInfo())
  }, [])

  const dispatch = useAppDispatch()
  const user = useAppSelector(getAuthDataUser)

  const router = useRouter()

  const callMe = useCallback(async () => {
    try {
      const result = await dispatch(testAuthThunk()).unwrap()
    } catch (error) {
      const message = error as Error

      toast.error(`Ошибка ${message.message}`)
    }
  }, [dispatch])

  return (
    <div>
      <h2>Private page</h2>
      {/*<pre>*/}
      {/*  {deviceInfo &&*/}
      {/*    JSON.stringify(*/}
      {/*      {*/}
      {/*        ...deviceInfo,*/}
      {/*        isMobile: isMobileDevice(),*/}
      {/*        isTouch: isTouchDevice(),*/}
      {/*        isSmallScreen: isSmallScreen(),*/}
      {/*        screen: getScreenInfo(),*/}
      {/*      },*/}
      {/*      null,*/}
      {/*      2*/}
      {/*    )}*/}
      {/*</pre>*/}
      <h2>User</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <Button onClick={async () => await callMe()}>API Route</Button>
    </div>
  )
}
