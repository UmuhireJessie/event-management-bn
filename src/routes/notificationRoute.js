import express from 'express'
import NotificationController from '../controller/notificationController'
import isAuthenticated from "../middleware/verifyToken";
import checkRole from "../middleware/checkRole";

const router = express.Router()

router.get('/all', isAuthenticated, checkRole('admin'), NotificationController.getAllNotifications)
router.get('/single', isAuthenticated, NotificationController.getNotifications)
router.delete('/:id', isAuthenticated, NotificationController.deleteNotification)

export default router
