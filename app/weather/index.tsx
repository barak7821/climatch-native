import { useEffect, useState } from 'react'
import { Text, View } from "react-native"
import Loading from '../loading'
import { getFallbackColor, getSkyPalette, getWeatherOverlay } from '../../lib/skyPalettes'
import type { WeatherData } from '../../lib/types'
import { useWeather } from '../../utils/WeatherContext'

export default function Weather() {
    const { weatherData, outfitSuggestion } = useWeather()
    const [isHydrated, setIsHydrated] = useState(false)
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    })

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    const mainWeather = weatherData?.weather?.[0]?.main as WeatherData["weather"][number]["main"] | undefined
    const fallbackColor = getFallbackColor(mainWeather)
    const hour = new Date().getHours()
    const palette = getSkyPalette(hour, mainWeather)
    const weatherOverlay = getWeatherOverlay(mainWeather)

    const cardBg = {
        Clear: "bg-sky-200/60",
        Clouds: "bg-slate-300/60",
        Rain: "bg-slate-500/55",
        Drizzle: "bg-slate-500/55",
        Thunderstorm: "bg-slate-800/60",
        Squall: "bg-slate-800/60",
        Snow: "bg-sky-200/55",
        Fog: "bg-slate-300/55",
        Haze: "bg-slate-300/55",
        Mist: "bg-slate-300/55",
        Sand: "bg-amber-300/55",
        Dust: "bg-amber-300/55",
        Smoke: "bg-amber-300/55",
        Ash: "bg-amber-300/55",
        Tornado: "bg-slate-800/60",
        Default: "bg-sky-200/70"
    }

    const cardBgClass = mainWeather ? (cardBg[mainWeather as keyof typeof cardBg] || cardBg.Default) : cardBg.Default

    if (!isHydrated) {
        return (
            <View className="flex-1 min-h-screen bg-sky-500 px-6 py-6">
                <Loading />
            </View>
        )
    }

    if (!weatherData) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500 text-xl">No weather data available.</Text>
            </View>
        )
    }

    const minTemp = weatherData.main.temp_min ?? weatherData.main.temp
    const maxTemp = weatherData.main.temp_max ?? weatherData.main.temp

    return (
        <View className="flex-1 min-h-screen overflow-hidden" style={{ backgroundColor: fallbackColor }}>
            <View className="absolute inset-0" style={{ backgroundColor: weatherOverlay }} />

            <View className="flex-1 items-center px-4 pb-10 pt-12">
                <View className="w-full max-w-md items-center">
                    <View className="items-center rounded-full border border-white/30 bg-white/20 px-4 py-1">
                        <Text className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                            {today}
                        </Text>
                    </View>
                    <Text className="mt-5 text-2xl font-semibold tracking-wide text-white">
                        {weatherData.name}, {weatherData.sys.country}
                    </Text>
                </View>

                <View className="mt-8 w-full max-w-md items-center">
                    <Text className="text-[7.5rem] font-light leading-none tracking-tight text-white">
                        {Math.round(weatherData.main.temp)}°
                    </Text>
                    <Text className="mt-2 text-xl font-medium capitalize text-white/90">
                        {weatherData.weather[0].description}
                    </Text>
                    <View className="mt-3 flex-row items-center justify-center gap-4">
                        <Text className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                            H {Math.round(maxTemp)}°
                        </Text>
                        <Text className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                            L {Math.round(minTemp)}°
                        </Text>
                    </View>
                </View>

                <View className="mt-10 w-full max-w-md rounded-3xl border border-white/25 bg-white/20 p-5">
                    <View className="flex-row flex-wrap gap-4">
                        <View className={`${cardBgClass} w-[48%] rounded-2xl border border-white/15 p-4`}>
                            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Feels Like</Text>
                            <Text className="mt-2 text-2xl font-semibold text-white">{Math.round(weatherData.main.feels_like)}°C</Text>
                        </View>
                        <View className={`${cardBgClass} w-[48%] rounded-2xl border border-white/15 p-4`}>
                            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Humidity</Text>
                            <Text className="mt-2 text-2xl font-semibold text-white">{weatherData.main.humidity}%</Text>
                        </View>
                        <View className={`${cardBgClass} w-[48%] rounded-2xl border border-white/15 p-4`}>
                            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Wind</Text>
                            <Text className="mt-2 text-2xl font-semibold text-white">{weatherData.wind.speed} m/s</Text>
                        </View>
                        <View className={`${cardBgClass} w-[48%] rounded-2xl border border-white/15 p-4`}>
                            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Condition</Text>
                            <Text className="mt-2 text-2xl font-semibold capitalize text-white">{weatherData.weather[0].main}</Text>
                        </View>
                    </View>
                </View>

                <View className="mt-6 w-full max-w-md rounded-3xl border border-white/25 bg-white/20 px-5 py-4">
                    <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Outfit Suggestion</Text>
                    <Text className="mt-2 text-white/95">{outfitSuggestion}</Text>
                </View>
            </View>
        </View>
    )
}
