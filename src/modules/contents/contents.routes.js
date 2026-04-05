import express from "express";
import controller from "./contents.controller.js";

export const createContentsRouter = ({ requireAuth }) => {
  const router = express.Router();

  router.post("/", requireAuth, controller.createContent);

  return router;
};
