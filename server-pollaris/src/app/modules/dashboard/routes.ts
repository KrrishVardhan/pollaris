import express from "express";
import type { Router } from "express";
import DashboardController from "./controller.js";

const dashboardController = new DashboardController();

import { optionalAuthenticationMiddleware } from "../../../common/middlewares/auth-middleware.js";

export const dashboardRouter: Router = express.Router();

dashboardRouter.get(
  "/",
  optionalAuthenticationMiddleware(),
  dashboardController
    .handleDashboard
    .bind(dashboardController)
);