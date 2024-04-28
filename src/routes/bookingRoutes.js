import express from "express";
import Bookings from "../controller/bookingController";
import addBookingMiddleware from "../middleware/bookingValidate";
import validateUUIDMiddleware from "../middleware/validateUUID";
import isAuthenticated from "../middleware/verifyToken";
import checkRole from "../middleware/checkRole";

const router = express.Router();
router.post(
  "/event/:id",
  validateUUIDMiddleware,
  isAuthenticated,
  addBookingMiddleware,
  Bookings.addBooking
);
router.get(
  "/all",
  isAuthenticated,
  checkRole("admin"),
  Bookings.getAllBookingByAdmin
);
router.get("/single", isAuthenticated, Bookings.getAllBookingByUser);
router.get(
  "/:id",
  validateUUIDMiddleware,
  isAuthenticated,
  Bookings.getOneBooking
);
router.delete(
  "/:id",
  validateUUIDMiddleware,
  isAuthenticated,
  Bookings.deleteBooking
);
router.patch(
  "/:id",
  validateUUIDMiddleware,
  isAuthenticated,
  checkRole("admin"),
  addBookingMiddleware,
  Bookings.updateBooking
);

export default router;
