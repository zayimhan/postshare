import express from "express";
import controller from "./contentReply.controller.js";

export const createContentReplyRouter = ({ requireAuth }) => {
  const router = express.Router();

  router.post(
    "/contents/:contentId/reply",
    requireAuth,
    controller.createReply
  );

  router.get(
    "/contents/:contentId/replies",
    requireAuth,
    controller.getReplies
  );

  return router;
};
