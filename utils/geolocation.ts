import * as Location from "expo-location"
import { errorLog } from "../lib/logger"

export const getUserPosition = async () => {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== Location.PermissionStatus.GRANTED) {
            throw new Error("permission_denied")
        }

        const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        })
        const { latitude, longitude } = position.coords
        return { latitude, longitude }
    } catch (error) {
        errorLog("Error getting location:", error)
        if (error instanceof Error && error.message === "permission_denied") {
            throw error
        }
        throw new Error("unknown_error")
    }
}
