import express from "express";
import controller from "./messageReaction.controller.js";

export const createMessageReactionRouter = ({ requireAuth }) => {
    const router = express.Router();

    router.post(
        "/messages/:messageId/reactions",
        requireAuth,
        controller.toggleReaction
    );

    router.delete(
        "/messages/:messageId/reactions",
        requireAuth,
        controller.toggleReaction
    );

    return router;
};
