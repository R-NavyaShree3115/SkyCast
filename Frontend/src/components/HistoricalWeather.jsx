
import React, { useState } from "react";

function HistoricalWeather({ onSearch, history, loading }) {
    const [city, setCity] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (city.trim() && startDate && endDate) {
            onSearch(city.trim(), startDate, endDate);
        }
    };

    const daily =
        history?.history?.daily ||
        history?.weather?.daily ||
        history?.daily;

    return (
        <div>
            <h2>Historical Weather</h2>

            <form className="search-bar" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />

                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    required
                />

                <button type="submit" disabled={loading}>
                    Get History
                </button>
            </form>

            {daily?.time?.length > 0 && (
                <div className="history-list">
                    {daily.time.map((date, index) => (
                        <div className="saved-item" key={date}>
                            <strong>{date}</strong>
                            <p>
                                Maximum: {daily.temperature_2m_max?.[index]}°C
                            </p>
                            <p>
                                Minimum: {daily.temperature_2m_min?.[index]}°C
                            </p>
                            <p>
                                Rain: {daily.precipitation_sum?.[index]} mm
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {history && !daily?.time?.length && (
                <p>No historical records available.</p>
            )}
        </div>
    );
}

export default HistoricalWeather;
