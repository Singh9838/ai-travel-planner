const express = require("express");

const {
  createTrip,
  getTrips,
  updateTrip,
  deleteTrip,
   regenerateDay,
   addActivity,
   removeActivity

  } = require("../controllers/tripController");


const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();
router.put("/:id", protect, updateTrip);
router.delete("/:id", protect, deleteTrip);
router.post("/", protect, createTrip);
router.get("/", protect, getTrips);

router.put(
  "/:id/regenerate-day",
  protect,
  regenerateDay
);

router.put(
  "/:id/add-activity",
  protect,
  addActivity
);

router.put(
  "/:id/remove-activity",
  protect,
  removeActivity
);

module.exports = router;