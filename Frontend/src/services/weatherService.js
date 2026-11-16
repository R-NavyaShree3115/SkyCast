
import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api/weather"
});

export const searchWeather = (location) =>
    API.get("/search", { params: { location } });

export const searchByLocation = (latitude, longitude) =>
    API.get("/search", { params: { latitude, longitude } });

export const getHistoricalWeather = (location, startDate, endDate) =>
    API.get("/history", {
        params: { location, startDate, endDate }
    });

export const saveSearch = (location, label) =>
    API.post("/saved", { location, label });

export const getSavedSearches = () =>
    API.get("/saved");

export const updateSavedSearch = (id, label) =>
    API.put(`/saved/${id}`, { label });

export const refreshSavedSearch = (id) =>
    API.post(`/saved/${id}/refresh`);

export const deleteSavedSearch = (id) =>
    API.delete(`/saved/${id}`);

export const exportSavedSearches = (type) =>
    API.get(`/saved/export/${type}`, {
        responseType: "blob"
    });
