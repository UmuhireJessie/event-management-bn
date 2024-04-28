import express from "express";
import users from "./userRoutes";
import notification from "./notificationRoute";
import event from "./eventRoutes";
import booking from "./bookingRoutes";

const routes = express();

routes.use("/api/v1/users", users);
routes.use("/api/v1/notifications", notification);
routes.use("/api/v1/events", event);
routes.use("/api/v1/bookings", booking);

export default routes;
