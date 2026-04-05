import express from "express";
import controller from "./message.controller.js";

export const createMessageRouter = ({ requireAuth }) => {
    const router = express.Router();

    // mesaj gönder
    router.post(
        "/conversations/:conversationId/messages",
        requireAuth,
        controller.sendMessage
    );

    // mesajları getir (pagination)
    router.get(
        "/conversations/:conversationId/messages",
        requireAuth,
        controller.getMessages
    );

    return router;
};
