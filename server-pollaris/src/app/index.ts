import express from "express";
import type { Express } from "express";

import { authRouter } from "./modules/auth/routes.js";
import { pollRouter } from "./modules/poll/routes.js";
import { dashboardRouter } from "./modules/dashboard/routes.js";

import cors from "cors";

export function createExpressApp(): Express {
  const app = express();
  app.use(cors());

  // Middleware
  app.use(express.json());

  // Routes
  app.get("/", (req, res) => {
    return res.json({
      message: "Welcome to Pollaris Auth",
    });
  });
  app.use("/auth", authRouter);
  app.use("/polls", pollRouter);
  app.use("/dashboard", dashboardRouter);
  return app;
}
