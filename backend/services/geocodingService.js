import axios from "axios";

export const getLocation = async (location) => {
    const response = await axios.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        {
            params: {
                name: location,
                count: 5,
                language: "en",
                format: "json"
            }
        }
    );
    if (!response.data.results || response.data.results.length === 0) {
        throw new Error("Location not found");
    }
    return response.data.results.map((place) => ({
        name: place.name,
        country: place.country || "",
        admin1: place.admin1 || "",
        latitude: place.latitude,
        longitude: place.longitude
    }));
};
