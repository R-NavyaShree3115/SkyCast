
import React from "react";

function SavedSearches({
    searches = [],
    onEdit,
    onRefresh,
    onDelete
}) {
    return (
        <div>
            <h2>Saved Searches ({searches.length})</h2>

            {searches.length === 0 ? (
                <p>No saved locations yet.</p>
            ) : (
                <div className="saved-list">
                    {searches.map((item) => (
                        <div className="saved-item" key={item._id}>
                            <div>
                                <h3>{item.label || item.locationName}</h3>
                                <p>{item.locationName}, {item.country}</p>
                                <strong>
                                    {item.weather?.current?.temperature_2m ?? "--"}°C
                                </strong>
                            </div>

                            <div className="saved-actions">
                                <button onClick={() => onEdit(item)}>
                                    Edit
                                </button>

                                <button onClick={() => onRefresh(item._id)}>
                                    Refresh
                                </button>

                                <button
                                    className="delete-button"
                                    onClick={() => onDelete(item._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SavedSearches;
