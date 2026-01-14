import { ActivityIndicator, Text, View } from "react-native"

export default function Loading() {
  return (
    <View className="flex-1 min-h-screen items-center justify-center select-none">
      <ActivityIndicator size="large" color="#ffffff" />
      <Text className="mt-4 text-white font-medium tracking-wide">Loading...</Text>
    </View>
  )
}
