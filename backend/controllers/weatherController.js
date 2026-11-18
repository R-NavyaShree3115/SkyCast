import WeatherSearch from "../models/WeatherSearch.js";
import { getLocation } from "../services/geocodingService.js";
import { getWeather, getHistoricalWeather} from "../services/weatherService.js";



const searchWeather = async (req, res, next) => {
    try {
        console.log("SEARCH API CALLED");

        const { location, latitude, longitude } = req.query;
        let place;

        if (latitude !== undefined && longitude !== undefined) {
            const lat = Number(latitude);
            const lon = Number(longitude);

            if (
                !Number.isFinite(lat) ||
                !Number.isFinite(lon) ||
                lat < -90 || lat > 90 ||
                lon < -180 || lon > 180
            ) {
                return res.status(400).json({
                    message: "Invalid GPS coordinates"
                });
            }

            place = {
                name: "Current Location",
                country: "",
                latitude: lat,
                longitude: lon
            };

        } else if (location && location.trim()) {

            const results = await getLocation(location);

            console.log("Geocoding results:", results);

            if (!results || results.length === 0) {
                return res.status(404).json({
                    message: "Location not found"
                });
            }

            place = results[0];

        } else {
            return res.status(400).json({
                message: "Enter a location or provide GPS coordinates"
            });
        }

        const weather = await getWeather(
            place.latitude,
            place.longitude
        );

        console.log("Weather fetched successfully");

        return res.status(200).json({
            location: place,
            weather
        });

    } catch (error) {
        console.error("SEARCH WEATHER ERROR:", error);
        next(error);
    }
};

 const historicalWeather = async (req, res, next) => {
    try {
        const { location, startDate, endDate } = req.query;

        if (!location || !startDate || !endDate) {
            return res.status(400).json({
                message: "Enter location and both dates"
            });
        }

        const validDate = (date) =>
            /^\d{4}-\d{2}-\d{2}$/.test(date) &&
            !isNaN(Date.parse(date)) &&
            new Date(date).toISOString().slice(0, 10) === date;

        if (!validDate(startDate) || !validDate(endDate)) {
            return res.status(400).json({
                message: "Invalid date format. Use YYYY-MM-DD"
            });
        }

        if (startDate > endDate) {
            return res.status(400).json({
                message: "Start date must be before end date"
            });
        }

        const today = new Date().toISOString().slice(0, 10);

        if (endDate >= today) {
            return res.status(400).json({
                message: "Select dates in the past"
            });
        }

        const place = await getLocation(location);

        const weather = await getHistoricalWeather(
            place.latitude,
            place.longitude,
            startDate,
            endDate
        );

        res.json({
            location: place,
            weather
        });
    } catch (error) {
        next(error);
    }
};
const saveSearch = async (req, res, next) => {
    try {
        const { location, label } = req.body;

        if (!location || !location.trim()) {
            return res.status(400).json({
                message: "Location is required"
            });
        }

        const results = await getLocation(location);

if (!results || results.length === 0) {
    return res.status(404).json({
        message: "Location not found"
    });
}

const place = results[0];

        const saved = await WeatherSearch.create({
            label: label || "",
            locationName: place.name,
            country: place.country,
            latitude: place.latitude,
            longitude: place.longitude,
            weather: await getWeather(place.latitude, place.longitude)
        });

        res.status(201).json(saved);
    } catch (error) {
        next(error);
    }
};
 const getSavedSearches = async (req, res, next) => {
    try {
        const searches = await WeatherSearch.find().sort({
            savedAt: -1
        });

        res.json(searches);
    } catch (error) {
        next(error);
    }
};

 const getSavedSearch = async (req, res, next) => {
    try {
        const search = await WeatherSearch.findById(req.params.id);

        if (!search) {
            return res.status(404).json({
                message: "Saved search not found"
            });
        }

        res.json(search);
    } catch (error) {
        next(error);
    }
};

 const updateSearch = async (req, res, next) => {
    try {
        const search = await WeatherSearch.findById(req.params.id);

        if (!search) {
            return res.status(404).json({
                message: "Saved search not found"
            });
        }

        if (req.body.label !== undefined) {
            search.label = req.body.label;
        }

        if (req.body.location) {
            const place = await getLocation(req.body.location);

            search.locationName = place.name;
            search.country = place.country;
            search.latitude = place.latitude;
            search.longitude = place.longitude;

            search.weather = await getWeather(
                place.latitude,
                place.longitude
            );
        }

        await search.save();

        res.json(search);
    } catch (error) {
        next(error);
    }
};

 const refreshSearch = async (req, res, next) => {
    try {
        const search = await WeatherSearch.findById(req.params.id);

        if (!search) {
            return res.status(404).json({
                message: "Saved search not found"
            });
        }

        search.weather = await getWeather(
            search.latitude,
            search.longitude
        );

        await search.save();

        res.json(search);
    } catch (error) {
        next(error);
    }
};

 const deleteSearch = async (req, res, next) => {
    try {
        const search = await WeatherSearch.findByIdAndDelete(
            req.params.id
        );

        if (!search) {
            return res.status(404).json({
                message: "Saved search not found"
            });
        }

        res.json({
            message: "Search deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

 const exportJSON = async (req, res, next) => {
    try {
        const searches = await WeatherSearch.find();

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=skycast-weather.json"
        );

        res.json(searches);
    } catch (error) {
        next(error);
    }
};

 const exportCSV = async (req, res, next) => {
    try {
        const searches = await WeatherSearch.find();

        const rows = [
            [
                "Location",
                "Country",
                "Label",
                "Latitude",
                "Longitude",
                "Temperature",
                "Feels Like",
                "Humidity",
                "Wind Speed",
                "Saved Date"
            ]
        ];

        searches.forEach((item) => {
            const current = item.weather?.current || {};

            rows.push([
                item.locationName,
                item.country,
                item.label,
                item.latitude,
                item.longitude,
                current.temperature_2m,
                current.apparent_temperature,
                current.relative_humidity_2m,
                current.wind_speed_10m,
                item.savedAt.toISOString()
            ]);
        });

        const csv = rows.map((row) =>
            row.map((value) =>
                `"${String(value ?? "").replace(/"/g, '""')}"`
            ).join(",")
        ).join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=skycast-weather.csv"
        );

        res.send(csv);
    } catch (error) {
        next(error);
    }
};

export { saveSearch, getSavedSearches, getSavedSearch, updateSearch, refreshSearch, deleteSearch, exportJSON, exportCSV, historicalWeather, searchWeather };