
import React from "react";

function CurrentWeather({ location, weather, onSave }) {
    const current = weather?.current;

    if (!current) return null;

    return (
        <div>
            <h2>Current Weather</h2>

            <h3>{location?.name}, {location?.country}</h3>

            <div className="weather-info">
                <div>
                    <h1>{current.temperature_2m}°C</h1>
                    <p>Temperature</p>
                </div>

                <div>
                    <h3>{current.apparent_temperature}°C</h3>
                    <p>Feels Like</p>
                </div>

                <div>
                    <h3>{current.relative_humidity_2m}%</h3>
                    <p>Humidity</p>
                </div>

                <div>
                    <h3>{current.wind_speed_10m} km/h</h3>
                    <p>Wind Speed</p>
                </div>
            </div>

            {location?.name !== "Current Location" && (
                <button onClick={onSave}>Save Location</button>
            )}
        </div>
    );
}

export default CurrentWeather;
