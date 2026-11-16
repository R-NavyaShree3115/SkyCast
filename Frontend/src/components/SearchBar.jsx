
import React, { useState } from "react";

function SearchBar({ onSearch, onGPS, loading }) {
    const [city, setCity] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (city.trim()) {
            onSearch(city.trim());
        }
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter city or location"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
            />

            <button type="submit" disabled={loading}>
                Search
            </button>

            <button type="button" onClick={onGPS} disabled={loading}>
                Use My Location
            </button>
        </form>
    );
}

export default SearchBar;
