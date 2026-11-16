
import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema({
    label: {
        type: String,
        default: ""
    },
    locationName: String,
    country: String,
    latitude: Number,
    longitude: Number,
    weather: Object,
    savedAt: {
        type: Date,
        default: Date.now
    }
});

const WeatherSearch = mongoose.model("WeatherSearch", weatherSchema);

export default WeatherSearch;
