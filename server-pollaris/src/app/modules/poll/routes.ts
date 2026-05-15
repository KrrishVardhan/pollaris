import express from "express";
import type { Router } from "express";

import PollController from "./controller.js";

import { optionalAuthenticationMiddleware } from "../../../common/middlewares/auth-middleware.js";

const pollController = new PollController();

export const pollRouter: Router = express.Router();

pollRouter.post(
  "/create",
  optionalAuthenticationMiddleware(),
  pollController.handleCreate.bind(pollController),
);

pollRouter.get("/:pollId", pollController.handleGetPoll.bind(pollController));

pollRouter.post(
  "/:pollId/respond",
  optionalAuthenticationMiddleware(),
  pollController.handleRespond.bind(
    pollController
  )
);
