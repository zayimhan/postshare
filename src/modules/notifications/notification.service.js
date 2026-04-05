import Notification from "./notification.model.js";

const createNotification = async ({ userId, type, referenceId }) => {
    return Notification.create(userId, type, referenceId);
};

const getNotifications = async (userId) => {
    const [rows] = await Notification.getByUserId(userId);
    return rows;
};

const readNotifications = async (userId, notificationIds) => {
    return Notification.markAsRead(userId, notificationIds);
};

const getUnreadCount = async (userId) => {
    const [rows] = await Notification.getUnreadCount(userId);
    return rows[0].unread_count;
};

export default {
    createNotification,
    getNotifications,
    readNotifications,
    getUnreadCount,
};
