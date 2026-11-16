
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import WeatherMap from "./components/WeatherMap";
import SavedSearches from "./components/SavedSearches";
import HistoricalWeather from "./components/HistoricalWeather";
import ExportButtons from "./components/ExportButtons";
import {
    searchWeather,
    searchByLocation,
    getHistoricalWeather,
    saveSearch,
    getSavedSearches,
    updateSavedSearch,
    refreshSavedSearch,
    deleteSavedSearch,
    exportSavedSearches
} from "./services/weatherService";
import "./App.css";

function App() {
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const [savedSearches, setSavedSearches] = useState([]);
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadSavedSearches = async () => {
        try {
            const response = await getSavedSearches();
            const data = response.data;

            setSavedSearches(
                Array.isArray(data)
                    ? data
                    : data.savedSearches || data.searches || []
            );
        } catch (err) {
            setError("Could not load saved locations.");
        }
    };

    useEffect(() => {
        loadSavedSearches();
    }, []);

    const handleSearch = async (city) => {
        try {
            setLoading(true);
            setError("");
            setHistory(null);

            const response = await searchWeather(city);

            setLocation(response.data.location);
            setWeather(response.data.weather);
        } catch (err) {
            setError(err.response?.data?.message || "Location not found.");
        } finally {
            setLoading(false);
        }
    };

    const handleGPS = () => {
        if (!navigator.geolocation) {
            setError("GPS is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    setLoading(true);
                    setError("");

                    const response = await searchByLocation(
                        position.coords.latitude,
                        position.coords.longitude
                    );

                    setLocation(response.data.location);
                    setWeather(response.data.weather);
                } catch (err) {
                    setError("Could not get weather for your location.");
                } finally {
                    setLoading(false);
                }
            },
            () => setError("Please allow location access.")
        );
    };

    const handleSave = async () => {
        if (!location || location.name === "Current Location") {
            setError("Search for a named city before saving.");
            return;
        }

        try {
            await saveSearch(location.name, location.name);
            await loadSavedSearches();
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Could not save location.");
        }
    };

    const handleEdit = async (item) => {
        const label = prompt("Enter a new label:", item.label || "");

        if (label === null || !label.trim()) return;

        try {
            await updateSavedSearch(item._id, label.trim());
            await loadSavedSearches();
        } catch (err) {
            setError("Could not update location.");
        }
    };

    const handleRefresh = async (id) => {
        try {
            await refreshSavedSearch(id);
            await loadSavedSearches();
        } catch (err) {
            setError("Could not refresh weather.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this saved location?")) return;

        try {
            await deleteSavedSearch(id);
            await loadSavedSearches();
        } catch (err) {
            setError("Could not delete location.");
        }
    };

    const handleHistory = async (city, startDate, endDate) => {
        try {
            setLoading(true);
            setError("");
            setHistory(null);

            const response = await getHistoricalWeather(
                city,
                startDate,
                endDate
            );

            setHistory(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not load historical weather."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (type) => {
        try {
            const response = await exportSavedSearches(type);
            const url = URL.createObjectURL(response.data);
            const link = document.createElement("a");

            link.href = url;
            link.download = `skycast-weather.${type === "json" ? "json" : "csv"}`;
            link.click();

            URL.revokeObjectURL(url);
        } catch (err) {
            setError("Could not export weather data.");
        }
    };

    return (
        <div className="app">
            <Navbar />

            <main className="dashboard">

                <section className="container">
                    <h2>Search Location</h2>
                    <SearchBar
                        onSearch={handleSearch}
                        onGPS={handleGPS}
                        loading={loading}
                    />
                </section>

                {error && <p className="error">{error}</p>}
                {loading && <p className="loading">Loading...</p>}

                {weather && (
                    <>
                        <div className="weather-container">
                            <section className="container">
                                <CurrentWeather
                                    location={location}
                                    weather={weather}
                                    onSave={handleSave}
                                />
                            </section>

                            <section className="container">
                                <Forecast weather={weather} />
                            </section>
                        </div>

                        <section className="container">
                            <h2>Location Map</h2>
                            <WeatherMap location={location} />
                        </section>
                    </>
                )}

                <section className="container">
                    <HistoricalWeather
                        onSearch={handleHistory}
                        history={history}
                        loading={loading}
                    />
                </section>

                <section className="container">
                    <SavedSearches
                        searches={savedSearches}
                        onEdit={handleEdit}
                        onRefresh={handleRefresh}
                        onDelete={handleDelete}
                    />
                </section>

                <section className="container">
                    <ExportButtons onExport={handleExport} />
                </section>

            </main>
        </div>
    );
}

export default App;
