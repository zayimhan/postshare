import express from "express";
import controller from "./conversation.controller.js";

export const createConversationRouter = ({ requireAuth }) => {
    const router = express.Router();

    router.post(
        "/conversations",
        requireAuth,
        controller.createConversation // ✅ DOĞRU
    );

    return router;
};
