
import React from "react";

function ExportButtons({ onExport }) {
    return (
        <div>
            <h2>Export Weather Data</h2>

            <div className="export-buttons">
                <button onClick={() => onExport("json")}>
                    Download JSON
                </button>

                <button onClick={() => onExport("csv")}>
                    Download CSV
                </button>
            </div>
        </div>
    );
}

export default ExportButtons;
