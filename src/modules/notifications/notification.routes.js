import express from "express";
import controller from "./notification.controller.js";

export const createNotificationRouter = ({ requireAuth }) => {
    const router = express.Router();

    router.get("/notifications/", requireAuth, controller.getNotifications);
    router.post("/notifications/read", requireAuth, controller.readNotifications);
    router.get(
        "/notifications/unread-count",
        requireAuth,
        controller.getUnreadCount
    );

    return router;
};
