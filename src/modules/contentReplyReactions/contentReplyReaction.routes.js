import express from "express";
import controller from "./contentReplyReaction.controller.js";

export const createContentReplyReactionRouter = ({ requireAuth }) => {
    const router = express.Router();

    router.post(
        "/replies/:replyId/reactions",
        requireAuth,
        controller.toggleReaction
    );

    router.delete(
        "/replies/:replyId/reactions",
        requireAuth,
        controller.toggleReaction
    );

    router.get(
        "/replies/:replyId/reactions",
        requireAuth,
        controller.getReplyReactions
    );


    return router;
};
