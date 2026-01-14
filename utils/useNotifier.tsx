import { useMemo } from "react"
import Notifier from "@seybar/react-native-notifier"
import type { IconConfig } from "@seybar/react-native-notifier/lib/types"

type NotifyOptions = {
  title?: string
}

export const useNotifier = () => {
  return useMemo(() => {
    const showBanner = (
      message: string,
      {
        title,
        backgroundColor,
        titleColor,
        descriptionColor,
        icon,
      }: {
        title: string
        backgroundColor: string
        titleColor: string
        descriptionColor: string
        icon: IconConfig
      }
    ) => {
      Notifier.showNotificationBanner({
        title,
        description: message,
        duration: 3000,
        position: "top",
        swipeDirection: "none",
        hideOnPress: false,
        backgroundColor,
        titleColor,
        descriptionColor,
        icon,
      })
    }

    return {
      error: (message: string, options: NotifyOptions = {}) =>
        showBanner(message, {
          title: options.title ?? "Error",
          backgroundColor: "#fee2e2",
          titleColor: "#991b1b",
          descriptionColor: "#7f1d1d",
          icon: { library: "Ionicons", name: "alert-circle", size: 22 },
        }),
      success: (message: string, options: NotifyOptions = {}) =>
        showBanner(message, {
          title: options.title ?? "Success",
          backgroundColor: "#dcfce7",
          titleColor: "#166534",
          descriptionColor: "#14532d",
          icon: { library: "Ionicons", name: "checkmark-circle", size: 22 },
        }),
      info: (message: string, options: NotifyOptions = {}) =>
        showBanner(message, {
          title: options.title ?? "Info",
          backgroundColor: "#dbeafe",
          titleColor: "#1e3a8a",
          descriptionColor: "#1e40af",
          icon: { library: "Ionicons", name: "information-circle", size: 22 },
        }),
    }
  }, [])
}
