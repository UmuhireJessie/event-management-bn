import { Notification } from "../database/models";

class NotificationSvc {
  static async getAllNotifications(pageSize, offset) {
    const totalCount = await Notification.count();
    const allNotifications = await Notification.findAll({
      limit: pageSize,
      offset: offset,
    });

    return { allNotifications, totalCount };
  }
  static async getNotificationById(pageSize, offset, userId) {
    const totalCount = await Notification.count({ where: { userId: userId } });
    const notification = await Notification.findAll({
      where: { userId: userId },
      limit: pageSize,
      offset: offset,
    });
    return { notification, totalCount };
  }
  static async getNotificationByItsId(id, userId) {
    const notification = await Notification.findOne({
      where: { userId, notificationId: id },
    });
    return notification;
  }
}
export default NotificationSvc;
