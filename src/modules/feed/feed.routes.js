import express from "express";
import controller from "./feed.controller.js";

export const createFeedRouter = ({requireAuth}) => {
    const router = express.Router();

    router.get("/", requireAuth, controller.getFeed);
    router.post("/filtered", requireAuth, controller.getFilteredFeed);
    router.post(
        "/:contentId/send",
        requireAuth,
        controller.sendToFriend
    );


    return router;
};
