export type WeatherData = {
    name: string
    sys: {
        country: string
    }
    main: {
        temp: number
        feels_like: number
        humidity: number
        temp_min: number
        temp_max: number
    }
    weather: Array<{
        main: string
        description: string
    }>
    wind: {
        speed: number
    }
}


export type WeatherContextValue = {
    weatherData: WeatherData | null
    setWeatherData: React.Dispatch<React.SetStateAction<WeatherData | null>>
    outfitSuggestion: string | null
    setOutfitSuggestion: React.Dispatch<React.SetStateAction<string | null>>
}

export type CacheEntry<T> = {
    value: T
    expiresAt: number
}

export type CacheStore = Map<string, CacheEntry<unknown>>

export type RateLimitEntry = {
    count: number
    resetAt: number
}

export type RateLimitStore = Map<string, RateLimitEntry>

export type SkySegment = "night" | "dawn" | "day" | "dusk"
export type BaseSkyPalette = { top: string; mid: string; bottom: string; glow: string }
export type SkyPalette = { top: string; upper: string; mid: string; lower: string; bottom: string; glow: string }
export type WeatherPaletteKey = "clear" | "clouds" | "rain" | "storm" | "snow" | "fog" | "dust" | "extreme"
