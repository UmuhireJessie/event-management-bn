import NotificationSvc from "../service/notificationService";

export default class NotificationController {
  static async getAllNotifications(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const offset = (page - 1) * pageSize;

      const { allNotifications, totalCount } =
        await NotificationSvc.getAllNotifications(pageSize, offset);
      return res.status(200).json({
        status: "success",
        data: allNotifications,
        page,
        pageSize,
        total: totalCount,
      });
    } catch (error) {
      return res.status(500).json({ status: "error", error: error.message });
    }
  }
  static async getNotifications(req, res) {
    try {
      const user = req.user;
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const offset = (page - 1) * pageSize;

      const { notification, totalCount } =
        await NotificationSvc.getNotificationById(
          pageSize,
          offset,
          user.userId
        );

      return res.status(200).json({
        status: "success",
        data: notification,
        page,
        pageSize,
        total: totalCount,
      });
    } catch (error) {
      return res.status(500).json({ status: "error", error: error.message });
    }
  }
  static async deleteNotification (req, res) {
    try {
      const { id } = req.params
      const { userId } = req.user
      const notification = await NotificationSvc.getNotificationByItsId(id, userId)
      if (!notification) {
        return res.status(404).json({
          status: 'fail',
          message: 'Notification is not found'
        })
      }
      
      await notification.destroy()
      return res.status(200).json({
        status: 'success',
        message: 'Notification deleted successfully'
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', error: error.message })
    }
  }
}
