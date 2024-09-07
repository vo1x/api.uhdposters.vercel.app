import express from "express";
const router = express.Router();
import mediaController from "../controllers/mediaController";

// Define routes
router.get("/media/:mediaType/:mediaID", mediaController.getMediaDetails);
router.get("/trending", mediaController.getTrending);
router.get("/search", mediaController.getSearch);
router.get("/find", mediaController.findByID);
router.get("/", mediaController.getRoot);
router.get("/schedule", mediaController.createSchedule);

export default router;
