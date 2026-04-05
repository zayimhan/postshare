import notificationService from "./notification.service.js";

const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const notifications =
            await notificationService.getNotifications(userId);

        res.json(notifications);
    } catch (err) {
        next(err);
    }
};

const readNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { notificationIds } = req.body;

        await notificationService.readNotifications(
            userId,
            notificationIds
        );

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

const getUnreadCount = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const unreadCount =
            await notificationService.getUnreadCount(userId);

        res.json({ unreadCount });
    } catch (err) {
        next(err);
    }
};

export default {
    getNotifications,
    readNotifications,
    getUnreadCount,
};
