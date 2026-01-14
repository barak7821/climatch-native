import { log } from "../lib/logger"

export const fetchWeatherData = async (latitude: number, longitude: number, style: string) => {
    if (latitude === undefined || longitude === undefined || latitude === null || longitude === null || !style) {
        throw new Error("Latitude, longitude, and style are required")
    }

    const res = await fetch(`https://climatch-dusky.vercel.app/api/weather`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ latitude, longitude, style })
    })
    log("Fetched weather data from server API", { latitude, longitude, style })
    return res.json()
}

export const fetchWeatherDataByCity = async (city: string, style: string) => {
    if (!city || !style) {
        throw new Error("City and style are required")
    }

    const res = await fetch(`https://climatch-dusky.vercel.app/api/weatherManual`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ city, style })
    })
    log("Fetched weather data by city from server API", { city, style })
    return res.json()
}