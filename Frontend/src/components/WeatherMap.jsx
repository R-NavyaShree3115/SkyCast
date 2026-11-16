
import React from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

function WeatherMap({ location }) {
    if (!location) return <p>Search a location to view the map.</p>;

    const latitude = location.latitude;
    const longitude = location.longitude;

    if (latitude == null || longitude == null) {
        return <p>Map coordinates are unavailable.</p>;
    }

    return (
        <div className="map">
            <MapContainer
                center={[latitude, longitude]}
                zoom={11}
                style={{ height: "300px", width: "100%" }}
                key={`${latitude}-${longitude}`}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[latitude, longitude]}>
                    <Popup>{location.name}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default WeatherMap;
