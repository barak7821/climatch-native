import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { WeatherProvider } from "../utils/WeatherContext";
import Notifier from "@seybar/react-native-notifier";
import "../global.css";

export default function RootLayout() {
  return (
    <WeatherProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Notifier.Container />
      </SafeAreaProvider>
    </WeatherProvider>
  )
}
