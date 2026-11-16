
import express from "express";

import {
    searchWeather,
    historicalWeather,
    saveSearch,
    getSavedSearches,
    getSavedSearch,
    updateSearch,
    refreshSearch,
    deleteSearch,
    exportJSON,
    exportCSV
} from "../controllers/weatherController.js";

const router = express.Router();

router.get("/search", searchWeather);
router.get("/history", historicalWeather);

router.post("/saved", saveSearch);
router.get("/saved", getSavedSearches);

router.get("/saved/export/json", exportJSON);
router.get("/saved/export/csv", exportCSV);

router.get("/saved/:id", getSavedSearch);
router.put("/saved/:id", updateSearch);
router.post("/saved/:id/refresh", refreshSearch);
router.delete("/saved/:id", deleteSearch);

export default router;