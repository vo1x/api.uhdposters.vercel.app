const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/mediaController");

// Define routes
router.get("/media/:mediaType/:mediaID", mediaController.getMediaDetails);
router.get("/trending", mediaController.getTrending);
router.get("/search", mediaController.getSearch);
router.get('/find',mediaController.findByID)
router.get("/", mediaController.getRoot);

module.exports = router;
