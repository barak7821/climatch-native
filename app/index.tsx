import { useEffect, useState } from 'react'
import { fetchWeatherData, fetchWeatherDataByCity } from '../services/weatherApiClient'
import { getUserPosition } from '../utils/geolocation'
import { useNotifier } from '../utils/useNotifier'
import { useWeather } from '../utils/WeatherContext'
import { errorLog } from '../lib/logger'
import type { WeatherData } from '../lib/types'
import Loading from './loading'
import { router } from 'expo-router'
import { Keyboard, Pressable, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"

export default function Home() {
    const notifier = useNotifier()
    const [enabledLocationInput, setEnabledLocationInput] = useState(false)
    const [city, setCity] = useState("")
    const [latitude, setLatitude] = useState<number | null>(null)
    const [longitude, setLongitude] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { setWeatherData, setOutfitSuggestion } = useWeather()
    const [style, setStyle] = useState("comfortable everyday")

    useEffect(() => {
        const checkLocationPermission = async () => {
            // Get the user's location using the Geolocation API, else use the manual input
            if (!enabledLocationInput) {
                try {
                    const { latitude, longitude } = await getUserPosition()
                    setLatitude(latitude)
                    setLongitude(longitude)
                } catch (error) {
                    if (error instanceof Error && error.message === "permission_denied") {
                        notifier.error("Location permission denied. Please enter your location manually.")
                        errorLog("Location permission denied by user.")
                    } else {
                        notifier.error("Unable to retrieve your location. Please enter it manually.")
                        errorLog("Error retrieving user location:", error)
                    }
                    setEnabledLocationInput(true)
                    return
                }
            }
        }
        checkLocationPermission()
    }, [])

    const handleStyleChange = (newStyle: string) => {
        setStyle(newStyle)
    }

    const handleClick = async () => {
        // Check if manual location input is enabled and city is provided
        if (enabledLocationInput && !city) {
            notifier.error("Please enter a city.")
            return
        }

        setIsLoading(true) // Set loading state to true
        try {
            let weather: WeatherData
            let outfit: string

            if (enabledLocationInput) {
                const result = await fetchWeatherDataByCity(city, style)
                weather = result.weather
                outfit = result.outfit
            } else {
                if (latitude === null || longitude === null) {
                    notifier.error("Unable to retrieve your location. Please try again.")
                    errorLog("Unable to retrieve user location.")
                    return
                }
                const result = await fetchWeatherData(latitude, longitude, style)
                weather = result.weather
                outfit = result.outfit
            }

            // Set the weather data and outfit suggestion in context
            setWeatherData(weather)
            setOutfitSuggestion(outfit)

            // Navigate to the weather page
            router.push("/weather")
        } catch (error) {
            errorLog("Error fetching weather data:", error)
            notifier.error("Error fetching weather data. Please try again.")
        } finally {
            setIsLoading(false) // Set loading state to false
        }
    }

    // If loading is true, load the loading component
    if (isLoading) return (
        <LinearGradient colors={["#3b82f6", "#93c5fd"]} style={{ minHeight: "100%", paddingHorizontal: 24, paddingVertical: 24 }}>
            <SafeAreaView className="flex-1 items-center justify-center font-sans select-none">
                <Loading />
            </SafeAreaView>
        </LinearGradient>
    )

    return (
        <LinearGradient colors={["#3b82f6", "#93c5fd"]} style={{ minHeight: "100%", paddingHorizontal: 24, paddingVertical: 24 }}>
            <SafeAreaView className="flex-1 font-sans select-none">
                <Pressable onPress={Keyboard.dismiss} className="flex-1" accessibilityRole="none">
                    <View className="flex flex-col items-center justify-center flex-1 w-full">
                        {/* Title */}
                        <Text className="text-7xl font-bold text-white drop-shadow-md tracking-wide mb-0 mt-50 italic font-serif">
                            Climatch
                        </Text>
                        <Text className="text-lg text-white/90">
                            Let the Weather Choose Your Style
                        </Text>

                        {/* City input field (manual) */}
                        {enabledLocationInput &&
                            <TextInput value={city} onChangeText={setCity} placeholder="Enter your city" placeholderTextColor="rgba(255, 255, 255, 0.8)" keyboardType="default" className="w-full max-w-sm py-3 px-5 mt-6 mb-6 bg-white/30 text-white placeholder-white/80 rounded-lg focus:outline-none" />
                        }

                        {/* button */}
                        <Pressable onPress={handleClick} disabled={isLoading} accessibilityLabel="Get My Outfit Suggestion" className="w-full max-w-sm py-3 bg-white rounded-lg active:opacity-80">
                            <Text className="text-center font-semibold text-blue-600">Get My Outfit Suggestion</Text>
                        </Pressable>
                    </View>
                </Pressable>

                {/* Style buttons */}
                <View className="flex flex-col items-center justify-end w-full">
                    {/* Title */}
                    <Text className="mb-2 text-white/90 text-xl font-medium">Choose your style (optional)</Text>
                    <View className="w-full max-w-sm mb-8 mx-auto flex flex-row flex-wrap justify-center gap-2">
                        <Pressable disabled={isLoading} accessibilityLabel="Casual style" className={`w-[30%] min-w-[90px] items-center justify-center py-3 rounded-3xl transition ${style === "Casual" ? "bg-yellow-400 " : "bg-yellow-100 hover:bg-yellow-200"}`} onPress={() => handleStyleChange("Casual")}>
                            <Text className={`text-md font-medium ${style === "Casual" ? "text-yellow-900" : "text-yellow-700"}`}>Casual</Text>
                        </Pressable>
                        <Pressable disabled={isLoading} accessibilityLabel="Sport style" className={`w-[30%] min-w-[90px] items-center justify-center py-3 rounded-3xl transition ${style === "Sport" ? "bg-green-400" : "bg-green-100 hover:bg-green-200"}`} onPress={() => handleStyleChange("Sport")}>
                            <Text className={`text-md font-medium ${style === "Sport" ? "text-green-900" : "text-green-700"}`}>Sport</Text>
                        </Pressable>
                        <Pressable disabled={isLoading} accessibilityLabel="Office style" className={`w-[30%] min-w-[90px] items-center justify-center py-3 rounded-3xl transition ${style === "Office" ? "bg-blue-400" : "bg-blue-100 hover:bg-blue-200"}`} onPress={() => handleStyleChange("Office")}>
                            <Text className={`text-md font-medium ${style === "Office" ? "text-blue-900" : "text-blue-700"}`}>Office</Text>
                        </Pressable>
                        <View className="w-full flex-row justify-center gap-2 mt-1">
                            <Pressable disabled={isLoading} accessibilityLabel="Elegant style" className={`w-[30%] min-w-[90px] items-center justify-center py-3 rounded-3xl transition ${style === "Elegant" ? "bg-pink-400" : "bg-pink-100 hover:bg-pink-200"}`} onPress={() => handleStyleChange("Elegant")}>
                                <Text className={`text-md font-medium ${style === "Elegant" ? "text-pink-900" : "text-pink-700"}`}>Elegant</Text>
                            </Pressable>
                            <Pressable disabled={isLoading} accessibilityLabel="Streetwear style" className={`w-[30%] min-w-[110px] items-center justify-center py-3 rounded-3xl transition ${style === "Streetwear" ? "bg-gray-400" : "bg-gray-200 hover:bg-gray-300"}`} onPress={() => handleStyleChange("Streetwear")}>
                                <Text className={`text-md font-medium ${style === "Streetwear" ? "text-gray-900" : "text-gray-700"}`}>Streetwear</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View className="block text-center text-sm text-white/80 mt-2">
                    <Text className="text-sm text-white/80 text-center">© {new Date().getFullYear()} Climatch</Text>
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}
