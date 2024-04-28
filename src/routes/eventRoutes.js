import express from "express";
import Events from "../controller/eventController";
import addEventMiddleware from "../middleware/eventValidate";
import validateUUIDMiddleware from "../middleware/validateUUID";
import isAuthenticated from "../middleware/verifyToken";
import checkRole from "../middleware/checkRole";

const router = express.Router();
router.post(
  "",
  isAuthenticated,
  checkRole("admin"),
  addEventMiddleware,
  Events.addEvent
);
router.get("/all", Events.getAllEvents);
router.get("/:id", validateUUIDMiddleware, Events.getEvent);
router.patch(
  "/:id",
  validateUUIDMiddleware,
  isAuthenticated,
  checkRole("admin"),
  addEventMiddleware,
  Events.updateEvent
);
router.delete(
  "/:id",
  validateUUIDMiddleware,
  isAuthenticated,
  checkRole("admin"),
  Events.deleteEvent
);
export default router;
