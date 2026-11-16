
import axios from "axios";

const getWeather = async (latitude, longitude) => {
    const response = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        {
            params: {
                latitude,
                longitude,
                current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
                daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
                forecast_days: 5,
                timezone: "auto"
            }
        }
    );

    return response.data;
};

const getHistoricalWeather = async (
    latitude,
    longitude,
    startDate,
    endDate
) => {
    const response = await axios.get(
        "https://archive-api.open-meteo.com/v1/archive",
        {
            params: {
                latitude,
                longitude,
                start_date: startDate,
                end_date: endDate,
                daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
                timezone: "auto"
            }
        }
    );

    return response.data;
};

const suggestLocations = async (req, res, next) => {
    try {
        const { location } = req.query;

        if (!location || !location.trim()) {
            return res.json([]);
        }

        const places = await getLocation(location.trim());
        res.json(places);
    } catch (error) {
        next(error);
    }
};

export { getWeather, getHistoricalWeather, suggestLocations };
