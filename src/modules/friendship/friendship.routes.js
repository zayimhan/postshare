import express from "express";
import controller from "./friendship.controller.js";

export const createFriendshipRouter = ({ requireAuth }) => {
  const router = express.Router();

  router.post("/request", requireAuth, controller.sendRequest);
  router.post("/accept", requireAuth, controller.acceptRequest);
  router.get("/", requireAuth, controller.getFriends);
  router.get("/requests", requireAuth, controller.getPendingRequests);
  router.post("/reject", requireAuth, controller.rejectRequest);
  router.post("/cancel", requireAuth, controller.cancelRequest);

  return router;
};
