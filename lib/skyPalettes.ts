import type { BaseSkyPalette, SkyPalette, SkySegment, WeatherData, WeatherPaletteKey } from "./types"

const SKY_PALETTES: Record<WeatherPaletteKey, Record<SkySegment, BaseSkyPalette>> = {
    clear: {
        night: { top: "#1f3354", mid: "#2b4d73", bottom: "#3d6a8f", glow: "#9cc9eb66" },
        dawn: { top: "#ffd9a6", mid: "#cde6ff", bottom: "#8fc7ff", glow: "#ffeaa077" },
        day: { top: "#7fc7ff", mid: "#52aef2", bottom: "#2f8edc", glow: "#ffe48f66" },
        dusk: { top: "#ffcfa0", mid: "#c2ddff", bottom: "#7fb2f0", glow: "#ffd69a66" }
    },
    clouds: {
        night: { top: "#2a384b", mid: "#354a5f", bottom: "#446179", glow: "#b9c6d866" },
        dawn: { top: "#d7d7d2", mid: "#c5ccd8", bottom: "#a9bfd6", glow: "#e7ebf277" },
        day: { top: "#c2d4e4", mid: "#aabfd6", bottom: "#8ea9c6", glow: "#e3e9f266" },
        dusk: { top: "#d3c9bf", mid: "#bcc1c8", bottom: "#9fb2cc", glow: "#e1d9d166" }
    },
    rain: {
        night: { top: "#2a3e56", mid: "#3a5270", bottom: "#4b6c86", glow: "#9abbd366" },
        dawn: { top: "#c6d3e0", mid: "#b2c6da", bottom: "#9bb5cd", glow: "#d7e2ee66" },
        day: { top: "#b9d2e6", mid: "#a4c2dc", bottom: "#8db2d1", glow: "#d2dfee66" },
        dusk: { top: "#bac7d6", mid: "#a7b8cd", bottom: "#94a9c4", glow: "#d2dbe866" }
    },
    storm: {
        night: { top: "#263349", mid: "#32445b", bottom: "#3e5770", glow: "#7e96af66" },
        dawn: { top: "#4a5a6e", mid: "#405365", bottom: "#354654", glow: "#8a9cb166" },
        day: { top: "#3e5268", mid: "#34485e", bottom: "#2c3e52", glow: "#8496ab66" },
        dusk: { top: "#41556a", mid: "#374a5f", bottom: "#2f4256", glow: "#879bb166" }
    },
    snow: {
        night: { top: "#273a52", mid: "#344a66", bottom: "#44607c", glow: "#d1e0f077" },
        dawn: { top: "#e2ebf6", mid: "#cddbed", bottom: "#b3c8e0", glow: "#efe2a4aa" },
        day: { top: "#d9e9f6", mid: "#c1d6eb", bottom: "#a7c1dc", glow: "#efdc98aa" },
        dusk: { top: "#e3deef", mid: "#cfcbe6", bottom: "#b4c0dd", glow: "#e5d09c88" }
    },
    fog: {
        night: { top: "#354356", mid: "#43546a", bottom: "#556c84", glow: "#d9e5f166" },
        dawn: { top: "#eef2f6", mid: "#e0e7f0", bottom: "#cbd7e5", glow: "#f6f7f977" },
        day: { top: "#e5edf6", mid: "#d7e1ef", bottom: "#c2d2e4", glow: "#f1f4f866" },
        dusk: { top: "#e0d7d0", mid: "#d1c8c9", bottom: "#bcc8dc", glow: "#ede3df66" }
    },
    dust: {
        night: { top: "#3f342d", mid: "#51443b", bottom: "#67584c", glow: "#f0d29a66" },
        dawn: { top: "#f8e5cc", mid: "#edd2af", bottom: "#d9b089", glow: "#f8e7c277" },
        day: { top: "#f3ddb5", mid: "#e6c79a", bottom: "#d0aa82", glow: "#f4dfb266" },
        dusk: { top: "#edd1b1", mid: "#dcb894", bottom: "#c59a76", glow: "#f2d2a666" }
    },
    extreme: {
        night: { top: "#1c2738", mid: "#253445", bottom: "#2f4053", glow: "#6f839a55" },
        dawn: { top: "#293545", mid: "#232f3f", bottom: "#1c2733", glow: "#6a7c9255" },
        day: { top: "#24303f", mid: "#1f2a39", bottom: "#182331", glow: "#65778d55" },
        dusk: { top: "#263242", mid: "#202b3b", bottom: "#182231", glow: "#6b7f9655" }
    }
}

const blendChannel = (from: number, to: number, ratio: number) =>
    Math.round(from + (to - from) * ratio)

const hexToRgb = (hex: string) => {
    const normalized = hex.replace("#", "").slice(0, 6)
    const value = parseInt(normalized, 16)
    return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255
    }
}

const rgbToHex = (r: number, g: number, b: number) =>
    `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`

const mixHex = (from: string, to: string, ratio: number) => {
    const start = hexToRgb(from)
    const end = hexToRgb(to)
    return rgbToHex(
        blendChannel(start.r, end.r, ratio),
        blendChannel(start.g, end.g, ratio),
        blendChannel(start.b, end.b, ratio)
    )
}

const withExtraStops = (palette: BaseSkyPalette): SkyPalette => ({
    ...palette,
    upper: mixHex(palette.top, palette.mid, 0.45),
    lower: mixHex(palette.mid, palette.bottom, 0.45)
})

const getWeatherKey = (weatherMain: WeatherData["weather"][number]["main"] | undefined): WeatherPaletteKey => {
    switch (weatherMain) {
        case "Clouds":
            return "clouds"
        case "Rain":
        case "Drizzle":
            return "rain"
        case "Thunderstorm":
            return "storm"
        case "Snow":
            return "snow"
        case "Fog":
        case "Mist":
        case "Haze":
            return "fog"
        case "Dust":
        case "Sand":
        case "Ash":
        case "Smoke":
            return "dust"
        case "Tornado":
        case "Squall":
            return "extreme"
        case "Clear":
        default:
            return "clear"
    }
}

export const getSkyPalette = (
    currentHour: number,
    weatherMain: WeatherData["weather"][number]["main"] | undefined
): SkyPalette => {
    const segment: SkySegment =
        currentHour < 6 ? "night" :
            currentHour < 10 ? "dawn" :
                currentHour < 17 ? "day" :
                    currentHour < 20 ? "dusk" : "night"

    return withExtraStops(SKY_PALETTES[getWeatherKey(weatherMain)][segment])
}

export const getFallbackColor = (mainWeather: WeatherData["weather"][number]["main"] | undefined) => {
    switch (mainWeather) {
        case "Clear": return "#86c8f3"
        case "Clouds": return "#b7cbe3"
        case "Rain":
        case "Drizzle": return "#86acd0"
        case "Thunderstorm": return "#22364f"
        case "Snow": return "#d3edff"
        case "Mist":
        case "Fog":
        case "Haze": return "#cbd7e6"
        case "Dust":
        case "Sand":
        case "Ash":
        case "Smoke": return "#deb887"
        case "Tornado":
        case "Squall": return "#182233"
        default: return "#86c8f3"
    }
}

export const getWeatherOverlay = (mainWeather: WeatherData["weather"][number]["main"] | undefined) => {
    switch (mainWeather) {
        case "Clouds":
            return "rgba(232, 238, 246, 0.08)"
        case "Rain":
        case "Drizzle":
            return "rgba(70, 96, 126, 0.12)"
        case "Thunderstorm":
            return "rgba(24, 34, 52, 0.24)"
        case "Snow":
            return "rgba(246, 251, 255, 0.12)"
        case "Fog":
        case "Mist":
        case "Haze":
            return "rgba(232, 238, 244, 0.12)"
        case "Dust":
        case "Sand":
        case "Ash":
        case "Smoke":
            return "rgba(224, 186, 140, 0.12)"
        default:
            return "rgba(0, 0, 0, 0)"
    }
}
