import { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { WeatherData, WeatherContextValue } from '../lib/types'

const WeatherContext = createContext<WeatherContextValue | null>(null)

export const WeatherProvider = ({ children }: { children: React.ReactNode }) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    const [outfitSuggestion, setOutfitSuggestion] = useState<string | null>(null)

    useEffect(() => {
        const fetchStoredWeather = async () => {
            const storedWeather = await AsyncStorage.getItem("weatherData")
            if (storedWeather && storedWeather !== "undefined") {
                try {
                    setWeatherData(JSON.parse(storedWeather))
                } catch {
                    await AsyncStorage.removeItem("weatherData")
                }
            }
            const storedOutfit = await AsyncStorage.getItem("outfitSuggestion")
            if (storedOutfit) {
                setOutfitSuggestion(storedOutfit)
            }
        }
        fetchStoredWeather()
    }, [])

    useEffect(() => {
        const saveWeatherData = async () => {
            if (weatherData !== null) {
                // Store weather data in AsyncStorage
                await AsyncStorage.setItem("weatherData", JSON.stringify(weatherData))
            }

            if (outfitSuggestion !== null) {
                // Store outfit suggestion in AsyncStorage
                await AsyncStorage.setItem("outfitSuggestion", outfitSuggestion)
            }
        }
        saveWeatherData()
    }, [weatherData, outfitSuggestion])

    return (
        <WeatherContext.Provider value={{ weatherData, setWeatherData, outfitSuggestion, setOutfitSuggestion }}>
            {children}
        </WeatherContext.Provider>
    )
}

export const useWeather = () => {
    const context = useContext(WeatherContext)
    if (!context) {
        throw new Error("useWeather must be used within a WeatherProvider")
    }
    return context
} // Custom hook to use the WeatherContext
