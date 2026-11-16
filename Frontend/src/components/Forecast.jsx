
import React from "react";

function Forecast({ weather }) {
    const daily = weather?.daily;

    if (!daily?.time) return null;

    return (
        <div>
            <h2>5-Day Forecast</h2>

            <div className="forecast">
                {daily.time.slice(0, 5).map((date, index) => (
                    <div className="forecast-item" key={date}>
                        <h4>{date}</h4>
                        <p>
                            {daily.temperature_2m_max[index]}°C
                        </p>
                        <p>
                            {daily.temperature_2m_min[index]}°C
                        </p>
                        <p>
                            Rain: {daily.precipitation_sum[index]} mm
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Forecast;
